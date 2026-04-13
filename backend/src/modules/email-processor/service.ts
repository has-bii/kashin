import { google } from "googleapis"
import { prisma } from "../../lib/prisma"
import { createEmailProcessorGraph } from "./graph"

export abstract class EmailProcessorService {
  /**
   * Called by QStash webhook. Full processing pipeline.
   */
  static async processEmail(userId: string, historyId: string) {
    try {
      // 1. Get user's Google credentials from Account table
      const account = await prisma.account.findFirst({
        where: { userId, providerId: "google" },
      })
      if (!account?.accessToken) return

      // 2. Fetch email content using Gmail API + historyId
      const emailData = await this.fetchEmailFromGmail(
        account.accessToken,
        account.refreshToken!,
        historyId,
      )
      if (!emailData) return

      // 3. Check user filter settings
      const settings = await prisma.userSettings.findUnique({
        where: { userId },
      })
      if (settings?.filterEmailsByBank) {
        const userBankEmails = await prisma.bankAccount.findMany({
          where: { userId },
          select: { bank: { select: { email: true } } },
        })
        const bankEmails = userBankEmails
          .map((ba) => ba.bank.email)
          .filter(Boolean)
        if (!bankEmails.includes(emailData.fromAddress)) return // silently ignore
      }

      // 4. Run LangGraph agent
      const graph = createEmailProcessorGraph()
      const result = await graph.invoke({
        emailBody: emailData.body,
        fromAddress: emailData.fromAddress,
        subject: emailData.subject,
        userId,
        isTransaction: false,
        extraction: null,
      })

      // 5. If not a transaction, silently ignore
      if (!result.isTransaction || !result.extraction) return

      // 6. Save EmailLog + AiExtraction
      // Find or use the user's EmailInbox
      const inbox = await prisma.emailInbox.findFirst({
        where: { userId },
      })
      if (!inbox) return

      const emailLog = await prisma.emailLog.create({
        data: {
          inboxId: inbox.id,
          userId,
          fromAddress: emailData.fromAddress,
          subject: emailData.subject,
          rawBody: emailData.body,
          status: "parsed",
          receivedAt: new Date(),
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
          extractedDate: result.extraction.date
            ? new Date(result.extraction.date)
            : null,
          extractedType: result.extraction.type,
          extractedNotes: result.extraction.notes,
          suggestedCategoryId: result.extraction.suggestedCategoryId,
          confidenceScore: result.extraction.confidenceScore,
          status: "pending",
        },
      })
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
    const auth = new google.auth.OAuth2()
    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    const gmail = google.gmail({ version: "v1", auth })

    // Get history since historyId
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

    // Fetch the latest message
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: messageIds[0]!,
      format: "full",
    })

    const headers = msg.data.payload?.headers ?? []
    const getHeader = (name: string) =>
      headers.find((h) => h.name === name)?.value ?? ""

    // Decode body from base64
    let body = ""
    if (msg.data.payload?.parts) {
      for (const part of msg.data.payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          body = Buffer.from(part.body.data, "base64").toString()
          break
        }
      }
    } else if (msg.data.payload?.body?.data) {
      body = Buffer.from(msg.data.payload.body.data, "base64").toString()
    }

    return {
      fromAddress: getHeader("From"),
      subject: getHeader("Subject"),
      body,
    }
  }
}
