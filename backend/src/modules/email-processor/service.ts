import { Prisma } from "../../generated/prisma/client"
import { agent } from "./agent"
import { generateHumanMessage } from "./human-message"
import { gmail_v1 } from "googleapis"
import { convert } from "html-to-text"
import PostalMime from "postal-mime"

interface ProcessEmailArgs {
  userId: string
  subject: string
  fromAddress: string
  body: string
}

export abstract class EmailProcessorService {
  /* ---------------------------- Public Functions ---------------------------- */
  static async parseEmail(messageData: gmail_v1.Schema$Message) {
    const rawEmail = Buffer.from(messageData.raw!, "base64")

    const parsed = await PostalMime.parse(rawEmail)

    let body: string | undefined | null = parsed.text

    if (parsed.html) {
      body = this.convertHtmlToText(parsed.html).trim()
    }

    return {
      fromAddress: parsed.from?.address || parsed.from?.name,
      subject: parsed.subject,
      body,
      receivedAt: new Date(Number(messageData.internalDate)),
    }
  }

  static async processEmail({ userId, ...email }: ProcessEmailArgs) {
    const humanMessage = generateHumanMessage(email)

    const response = await agent.invoke({ messages: [humanMessage] }, { context: { userId } })

    const tokenUsage = response.messages.reduce<number>((acc, msg) => {
      const meta = msg.response_metadata as any

      if (meta.estimatedTokenUsage && meta.estimatedTokenUsage.totalTokens) {
        return (acc + meta.estimatedTokenUsage.totalTokens) as number
      }
      return acc
    }, 0)

    return { result: response.structuredResponse, tokenUsage }
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
