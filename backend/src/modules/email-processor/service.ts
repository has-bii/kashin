import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { agent } from "./agent"
import { EmailInput, generateHumanMessage } from "./human-message"
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain"
import { gmail_v1 } from "googleapis"
import { convert } from "html-to-text"
import PostalMime from "postal-mime"

interface ProcessEmail extends EmailInput {
  userId: string
  aiExtractionId?: string
}

const tracer = new LangChainTracer()

export abstract class EmailProcessorService {
  /* ---------------------------- Public Functions ---------------------------- */
  static async getEmailBody(messageData: gmail_v1.Schema$Message) {
    const rawEmail = Buffer.from(messageData.raw!, "base64")

    const parsed = await PostalMime.parse(rawEmail)

    const emailHtml = parsed.html ? this.convertHtmlToText(parsed.html).trim() : undefined

    return {
      emailText: parsed.text,
      emailHtml,
    }
  }

  static async processEmail({ userId, aiExtractionId, ...email }: ProcessEmail) {
    const categories = await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
      },
    })

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId },
      select: {
        id: true,
        balance: true,
        bankId: true,
        bank: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    const humanMessage = generateHumanMessage(email, categories, bankAccounts)

    try {
      const response = await agent.invoke(
        { messages: [humanMessage] },
        {
          context: { userId },
          runName: "process-email",
          tags: ["email-processor", email.from, email.subject],
          metadata: { userId, aiExtractionId },
          signal: AbortSignal.timeout(60_000),
          recursionLimit: 10,
          callbacks: [tracer],
        },
      )

      logger.debug(
        { response: response.structuredResponse, userId, aiExtractionId },
        "Email processed",
      )

      const tokenUsage = response.messages.reduce<number>((acc, msg) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const meta = msg.response_metadata as any

        if (typeof meta?.tokenUsage?.total_tokens === "number") {
          return acc + meta.tokenUsage.total_tokens
        }
        return acc
      }, 0)

      return { result: response.structuredResponse, tokenUsage }
    } catch (error) {
      logger.error({ error, userId, aiExtractionId }, "Email processing failed")
      throw error
    }
  }

  /* ---------------------------- Private Functions --------------------------- */
  private static convertHtmlToText(html: string) {
    return convert(html, {
      baseElements: {
        selectors: ["body"],
      },
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", format: "skip" },
      ],
    }).trim()
  }
}
