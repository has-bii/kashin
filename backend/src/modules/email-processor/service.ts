import { google, gmail_v1 } from "googleapis"
import { prisma } from "../../lib/prisma"
import { createEmailProcessorGraph } from "./graph"

export abstract class EmailProcessorService {
  static createGmailClient(accessToken: string, refreshToken: string) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    return google.gmail({ version: "v1", auth })
  }

  static decodeGmailMessage(messageData: gmail_v1.Schema$Message): {
    gmailMessageId: string
    fromAddress: string
    subject: string
    body: string
    receivedAt: Date
  } {
    const headers = messageData.payload?.headers ?? []
    const getHeader = (name: string) =>
      headers.find((h) => h.name === name)?.value ?? ""

    let body = ""
    if (messageData.payload?.parts) {
      for (const part of messageData.payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          body = Buffer.from(part.body.data, "base64").toString()
          break
        }
      }
    } else if (messageData.payload?.body?.data) {
      body = Buffer.from(messageData.payload.body.data, "base64").toString()
    }

    return {
      gmailMessageId: messageData.id!,
      fromAddress: getHeader("From"),
      subject: getHeader("Subject"),
      body,
      receivedAt: new Date(Number(messageData.internalDate)),
    }
  }

  static async processEmailFromRaw(
    userId: string,
    emailData: {
      gmailMessageId: string
      fromAddress: string
      subject: string
      body: string
      receivedAt: Date
    },
  ): Promise<{ isTransaction: boolean }> {
    const settings = await prisma.userSettings.findUnique({ where: { userId } })
    if (settings?.filterEmailsByBank) {
      const userBankEmails = await prisma.bankAccount.findMany({
        where: { userId },
        select: { bank: { select: { email: true } } },
      })
      const bankEmails = userBankEmails.map((ba) => ba.bank.email).filter(Boolean)
      if (!bankEmails.includes(emailData.fromAddress)) return { isTransaction: false }
    }

    const graph = createEmailProcessorGraph()
    const result = await graph.invoke({
      emailBody: emailData.body,
      fromAddress: emailData.fromAddress,
      subject: emailData.subject,
      userId,
      isTransaction: false,
      extraction: null,
    })

    if (!result.isTransaction || !result.extraction) return { isTransaction: false }

    const inbox = await prisma.emailInbox.findFirst({ where: { userId } })
    if (!inbox) return { isTransaction: false }

    const emailLog = await prisma.emailLog.create({
      data: {
        inboxId: inbox.id,
        userId,
        gmailMessageId: emailData.gmailMessageId,
        fromAddress: emailData.fromAddress,
        subject: emailData.subject,
        rawBody: emailData.body,
        status: "parsed",
        receivedAt: emailData.receivedAt,
        processedAt: new Date(),
      },
    })

    await prisma.aiExtraction.create({
      data: {
        emailLogId: emailLog.id,
        userId,
        extractedVendor: result.extraction.vendor,
        extractedAmount: result.extraction.amount
          ? parseFloat(result.extraction.amount.toString())
          : null,
        extractedCurrency: result.extraction.currency ?? "IDR",
        extractedDate: result.extraction.date ? new Date(result.extraction.date) : null,
        extractedType: result.extraction.type,
        extractedNotes: result.extraction.notes,
        suggestedCategoryId: result.extraction.suggestedCategoryId,
        confidenceScore: result.extraction.confidenceScore,
        status: "pending",
      },
    })

    return { isTransaction: true }
  }

  /**
   * Called by QStash webhook. Full processing pipeline.
   */
  static async processEmail(userId: string, historyId: string) {
    try {
      const account = await prisma.account.findFirst({
        where: { userId, providerId: "google" },
      })
      if (!account?.accessToken) return

      const emailData = await this.fetchEmailFromGmail(
        account.accessToken,
        account.refreshToken!,
        historyId,
      )
      if (!emailData) return

      await this.processEmailFromRaw(userId, emailData)
    } catch (error) {
      console.error("Email processing error:", error)
    }
  }

  /**
   * Fetch email content from Gmail API using historyId.
   */
  private static async fetchEmailFromGmail(
    accessToken: string,
    refreshToken: string,
    historyId: string,
  ) {
    const gmail = this.createGmailClient(accessToken, refreshToken)

    const history = await gmail.users.history.list({
      userId: "me",
      startHistoryId: historyId,
      historyTypes: ["messageAdded"],
    })

    const messageIds = history.data.history
      ?.flatMap((h) => h.messagesAdded ?? [])
      .map((m) => m.message?.id)
      .filter(Boolean)

    if (!messageIds?.length) return null

    const msg = await gmail.users.messages.get({
      userId: "me",
      id: messageIds[0]!,
      format: "full",
    })

    return this.decodeGmailMessage(msg.data)
  }
}
