import { receiver } from "../../lib/qstash"
import { RecurringTransactionService } from "../recurring-transaction/service"
import { EmailProcessorService } from "../email-processor/service"
import { GmailService } from "../gmail/service"
import { WebhookService } from "./service"
import { prisma } from "../../lib/prisma"
import Elysia from "elysia"

export const webhookController = new Elysia({ prefix: "/webhook" })
  .post("/gmail", ({ headers, request, status }) => {
    const authHeader = headers["authorization"]
    if (!authHeader) return status(401)

    const token = authHeader.split(" ")

    return WebhookService.handleGmailWebhook(token[1], request)
  })
  .post("/process-email", async ({ request, headers, status }) => {
    const rawBody = await request.text()

    const isValid = await receiver
      .verify({
        signature: headers["upstash-signature"] ?? "",
        body: rawBody,
      })
      .catch(() => false)

    if (!isValid) return status(401)

    const { userId, historyId } = JSON.parse(rawBody) as {
      userId: string
      historyId: string
    }

    await EmailProcessorService.processEmail(userId, historyId)

    return { received: true }
  })
  .post("/process-imported-email", async ({ request, headers, status }) => {
    const rawBody = await request.text()

    const isValid = await receiver
      .verify({
        signature: headers["upstash-signature"] ?? "",
        body: rawBody,
      })
      .catch(() => false)

    if (!isValid) return status(401)

    const { userId, gmailMessageId, importId } = JSON.parse(rawBody) as {
      userId: string
      gmailMessageId: string
      importId: string
    }

    try {
      const account = await prisma.account.findFirst({
        where: { userId, providerId: "google" },
      })
      if (!account?.accessToken) throw new Error("No Google account")

      const emailData = await GmailService.fetchMessage(
        account.accessToken,
        account.refreshToken!,
        gmailMessageId,
      )

      await EmailProcessorService.processEmailFromRaw(userId, emailData)

      const emailImport = await prisma.emailImport.update({
        where: { id: importId },
        data: { processedEmails: { increment: 1 } },
      })

      const totalToProcess = emailImport.totalEmails - emailImport.skippedEmails
      if (emailImport.processedEmails + emailImport.failedEmails >= totalToProcess) {
        await prisma.emailImport.update({
          where: { id: importId },
          data: { status: "completed", completedAt: new Date() },
        })
      }
    } catch (error) {
      console.error("Import email processing error:", error)

      const emailImport = await prisma.emailImport.update({
        where: { id: importId },
        data: { failedEmails: { increment: 1 } },
      })

      const totalToProcess = emailImport.totalEmails - emailImport.skippedEmails
      if (emailImport.processedEmails + emailImport.failedEmails >= totalToProcess) {
        await prisma.emailImport.update({
          where: { id: importId },
          data: { status: "completed", completedAt: new Date() },
        })
      }
    }

    return { received: true }
  })
  .post("/recurring-transaction", async ({ request, headers, status }) => {
    const rawBody = await request.text()

    const isValid = await receiver
      .verify({
        signature: headers["upstash-signature"] ?? "",
        body: rawBody,
      })
      .catch(() => false)

    if (!isValid) return status(401)

    const { recurringTransactionId, scheduledFor } = JSON.parse(rawBody) as {
      recurringTransactionId: string
      scheduledFor: string
    }

    await RecurringTransactionService.processWebhook(recurringTransactionId, new Date(scheduledFor))

    return { received: true }
  })
