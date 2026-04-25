import { auth } from "../../lib/auth"
import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { AiUsageService } from "../ai-usage/service"
import { EmailProcessorService } from "../email-processor/service"
import { GmailService } from "../gmail/service"
import { inngest } from "./client"
import { EMAIL_EVENTS, type ProcessEmailEventData } from "./events"
import { NonRetriableError } from "inngest"

export const processEmail = inngest.createFunction(
  {
    id: "process-email",
    concurrency: { key: "event.data.userId", limit: 1 },
    triggers: { event: EMAIL_EVENTS.processEmail },
    retries: 2,
    idempotency: "event.data.aiExtractionId",
    cancelOn: [
      {
        event: EMAIL_EVENTS.cancelEmail,
        if: "async.data.aiExtractionId == event.data.aiExtractionId",
      },
    ],
    onFailure: async ({ error, event, step }) => {
      if (error.message === "Daily AI quota exceeded") return { status: "ok" }

      const { aiExtractionId } = event.data.event.data as ProcessEmailEventData

      logger.error({ error }, "Failed to process email")

      await step.run("handle-failure", () =>
        prisma.aiExtraction.updateMany({
          where: { id: aiExtractionId },
          data: { status: "failed", finishedAt: new Date() },
        }),
      )
    },
  },
  async ({ event, step }) => {
    const { userId, aiExtractionId } = event.data as ProcessEmailEventData

    logger.info({ userId, aiExtractionId }, "process-email: starting")

    await step.run("check-quota", async () => {
      const { count, limit } = await AiUsageService.getDailyUsage(userId)

      if (count >= limit) {
        throw new NonRetriableError("Daily AI quota exceeded")
      }
    })

    const record = await step.run("check-exist", async () => {
      const data = await prisma.aiExtraction.findUnique({
        where: { id: aiExtractionId },
        select: {
          id: true,
          gmailMessageId: true,
          emailFrom: true,
          emailSubject: true,
          emailSnippet: true,
          status: true,
        },
      })
      if (!data) throw new NonRetriableError("Email not found")
      if (data.status === "processing") throw new NonRetriableError("Email is being processed")
      if (data.status === "waitingApproval") throw new NonRetriableError("Email has been processed")
      if (data.status === "confirmed") throw new NonRetriableError("Email has been processed")
      return data
    })

    const rawEmail = await step.run("fetch-email", async () => {
      await prisma.aiExtraction.update({
        where: { id: aiExtractionId },
        data: { status: "processing", processedAt: new Date() },
      })

      const accessToken = await auth.api
        .getAccessToken({ body: { userId, providerId: "google" } })
        .then((res) => res.accessToken)
        .catch(() => null)

      if (!accessToken) throw new NonRetriableError("Your account hasn't linked to Google account")

      const { data } = await GmailService.fetchEmailByMessageId(
        accessToken,
        record.gmailMessageId,
      ).catch((error) => {
        logger.error({ userId, aiExtractionId, error }, "process-email: failed to fetch email")
        throw new NonRetriableError("Failed to fetch email", { cause: error })
      })

      return data
    })

    const parsedEmail = await step.run("parse-email", async () => {
      const data = await EmailProcessorService.getEmailBody(rawEmail).catch((error) => {
        logger.error({ userId, aiExtractionId, error }, "process-email: failed to parse email")
        throw new NonRetriableError("Failed to parse email", { cause: error })
      })

      await prisma.aiExtraction.update({
        where: { id: aiExtractionId },
        data: {
          emailText: data.emailText,
          emailHtml: data.emailHtml,
        },
      })

      if (!data.emailText && !data.emailHtml)
        throw new NonRetriableError("Failed to parse email body")

      return data
    })

    const { result, tokenUsage } = await step.run("analyze-email", async () => {
      return EmailProcessorService.processEmail({
        userId,
        aiExtractionId,
        from: record.emailFrom,
        subject: record.emailSubject,
        snippet: record.emailSnippet,
        body: parsedEmail.emailText || parsedEmail.emailHtml!,
      }).catch((error) => {
        logger.error({ userId, aiExtractionId, error }, "process-email: analyze-email failed")
        throw new Error("Failed to analyze email", { cause: error })
      })
    })

    await step.run("finalize", async () => {
      const [category, bankAccount] = await Promise.all([
        result.data?.categoryId
          ? prisma.category.findUnique({
              where: { id: result.data.categoryId },
              select: { id: true },
            })
          : null,
        result.data?.bankAccountId
          ? prisma.bankAccount.findUnique({
              where: { id: result.data.bankAccountId },
              select: { id: true },
            })
          : null,
      ])

      const isApproval = result?.isTransaction && result?.data != null

      await prisma.aiExtraction.update({
        where: { id: aiExtractionId },
        data: {
          tokenUsage,
          finishedAt: new Date(),
          note: result.description,
          ...(isApproval && result.data
            ? {
                status: "waitingApproval",
                extractedType: result.data.type,
                extractedMerchant: result.data.merchant,
                extractedAmount: result.data.amount,
                extractedBankAccountId: bankAccount?.id,
                extractedCategoryId: category?.id,
                extractedCurrency: result.data.currency,
                suggestedCategory: result.data.suggestedCategory,
              }
            : {
                rejectedAt: new Date(),
                status: "rejected",
              }),
        },
      })

      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      await prisma.$transaction([
        prisma.aiUsageDaily.upsert({
          where: { userId_date: { userId, date: today } },
          create: { userId, date: today, count: 1 },
          update: { count: { increment: 1 } },
        }),
        prisma.aiUsageEvent.create({
          data: { userId, kind: "email_extraction", refId: aiExtractionId, usageDate: today },
        }),
      ])
    })

    logger.info({ userId, aiExtractionId, tokenUsage }, "process-email: completed")

    await step.sleep("take-rest", "10s")

    return { message: "ok" }
  },
)
