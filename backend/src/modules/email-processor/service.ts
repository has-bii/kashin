import { logger } from "../../lib/logger"
import { agent } from "./agent"
import { GenerateHumanMessage, generateHumanMessage } from "./human-message"
import { isValid } from "date-fns"
import { gmail_v1 } from "googleapis"
import { convert } from "html-to-text"
import PostalMime from "postal-mime"

interface ProcessEmail extends GenerateHumanMessage {
  userId: string
  aiExtractionId?: string
}

export abstract class EmailProcessorService {
  /* ---------------------------- Public Functions ---------------------------- */
  static async parseEmail(messageData: gmail_v1.Schema$Message) {
    const rawEmail = Buffer.from(messageData.raw!, "base64")

    const parsed = await PostalMime.parse(rawEmail)

    const emailFrom =
      parsed.headers.find((acc) => acc.key === "from")?.value ||
      `${parsed.from?.name} <${parsed.from?.address}>`.trim()
    const emailReceivedAt = !parsed.date
      ? undefined
      : isValid(new Date(parsed.date))
        ? new Date(parsed.date)
        : undefined
    const emailHtml = parsed.html ? this.convertHtmlToText(parsed.html).trim() : undefined

    return {
      emailFrom,
      emailSubject: parsed.subject,
      emailText: parsed.text,
      emailHtml,
      emailReceivedAt,
    }
  }

  static async processEmail({ userId, aiExtractionId, ...email }: ProcessEmail) {
    const humanMessage = generateHumanMessage(email)

    try {
      const response = await agent.invoke(
        { messages: [humanMessage] },
        {
          context: { userId },
          runName: "process-email",
          tags: ["email-processor"],
          metadata: { userId, aiExtractionId },
          signal: AbortSignal.timeout(60_000),
          recursionLimit: 10,
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
      wordwrap: 130,
      selectors: [
        {
          selector: "img",
          format: "skip",
        },
        {
          selector: "a",
          format: "skip",
        },
      ],
    })
  }
}
