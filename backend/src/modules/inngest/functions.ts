import { auth } from "../../lib/auth"
import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { EmailProcessorService } from "../email-processor/service"
import { GmailService } from "../gmail/service"
import { inngest } from "./client"
import { NonRetriableError } from "inngest"

type ProcessEmailEventData = {
  aiExtractionId: string
  userId: string
}

export const INNGEST_FUNCTION_EVENTS = {
  processEmail: {
    key: "email/process.email",
    sendEvent: async (data: ProcessEmailEventData) => {
      return inngest.send({
        id: `process-email-${data.aiExtractionId}`,
        name: "email/process.email",
        data,
      })
    },
  },
  cancelEmail: {
    key: "email/cancel.email",
    sendEvent: async (data: { aiExtractionId: string }) =>
      inngest.send({ name: "email/cancel.email", data }),
  },
}

export const processEmail = inngest.createFunction(
  {
    id: "process-email",
    concurrency: {
      key: "event.data.userId",
      limit: 1,
    },
    debounce: {
      period: "5s",
    },
    triggers: {
      event: INNGEST_FUNCTION_EVENTS.processEmail.key,
    },
    retries: 2,
    cancelOn: [
      {
        event: INNGEST_FUNCTION_EVENTS.cancelEmail.key,
        if: "async.data.aiExtractionId == event.data.aiExtractionId",
      },
    ],
    onFailure: async ({ error, event, step }) => {
      const { aiExtractionId } = event.data.event.data as ProcessEmailEventData
      await step.run("handle-failure", async () => {
        await prisma.aiExtraction.updateMany({
          where: { id: aiExtractionId },
          data: { status: "failed", finishedAt: new Date(), errorMessage: error.message },
        })
      })
    },
  },
  async ({ event, step }) => {
    const { userId, aiExtractionId } = event.data as ProcessEmailEventData

    logger.info({ userId, aiExtractionId }, "process-email: starting")

    // Check if exists
    const record = await step.run("check-exist", async () => {
      const data = await prisma.aiExtraction.findUnique({
        where: { id: aiExtractionId },
        select: { id: true, gmailMessageId: true },
      })
      if (!data) throw new NonRetriableError("Email not found")
      return data
    })

    // Fetching Email
    const rawEmail = await step.run("fetching-email", async () => {
      await prisma.aiExtraction.update({
        where: { id: aiExtractionId },
        data: { status: "processing", processedAt: new Date() },
      })

      const accessToken = await auth.api
        .getAccessToken({
          body: { userId, providerId: "google" },
        })
        .then((res) => res.accessToken)
        .catch(() => null)

      if (!accessToken) throw new NonRetriableError("Your account hasn't linked to Google account")

      const { data } = await GmailService.fetchEmailByMessageId(
        accessToken,
        record.gmailMessageId,
      ).catch((error) => {
        logger.error({ userId, aiExtractionId, error }, "process-email: failed to fetch email")
        throw new NonRetriableError("Failed to getting email", { cause: error })
      })

      return data
    })

    // Parsing Email
    const parsedEmail = await step.run("parsing-email", async () => {
      const data = await EmailProcessorService.parseEmail(rawEmail).catch((error) => {
        logger.error({ userId, aiExtractionId, error }, "process-email: failed to parse email")
        throw new NonRetriableError("Failed to parse email", { cause: error })
      })

      await prisma.aiExtraction.update({
        where: { id: aiExtractionId },
        data: {
          emailFrom: data.emailFrom,
          emailSubject: data.emailSubject,
          emailReceivedAt: data.emailReceivedAt,
          emailText: data.emailText,
          emailHtml: data.emailHtml,
        },
      })

      if (!data.emailText && !data.emailHtml)
        throw new NonRetriableError("Failed to parse email body")

      if (!data.emailSubject) throw new NonRetriableError("Failed to parse email subject")

      return data
    })

    // Process
    const { result, tokenUsage } = await step.run("analyze-email", async () => {
      return EmailProcessorService.processEmail({
        userId,
        aiExtractionId,
        fromAddress: parsedEmail.emailFrom,
        subject: parsedEmail.emailSubject!,
        text: parsedEmail.emailText,
        html: parsedEmail.emailHtml,
        date: parsedEmail.emailReceivedAt,
      }).catch((error) => {
        logger.error({ userId, aiExtractionId, error }, "process-email: analyze-email failed")
        throw new Error("Failed to analyze email", { cause: error })
      })
    })

    // Update to the database
    await step.run("update-database", async () => {
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

      const finalStatus = result.isTransaction && result.data ? "waitingApproval" : "rejected"

      await prisma.aiExtraction.update({
        where: { id: aiExtractionId },
        data: {
          tokenUsage,
          finishedAt: new Date(),
          aiResponse: JSON.stringify(result),
          ...(finalStatus === "waitingApproval"
            ? {
                status: "waitingApproval",
                extractedType: result.data?.type,
                extractedMerchant: result.data?.merchant,
                extractedAmount: result.data?.amount,
                extractedBankAccountId: bankAccount?.id,
                extractedCategoryId: category?.id,
                extractedCurrency: result.data!.currency,
                extractedDate: result.data!.date,
                confidenceScore: result.data!.confidence,
                suggestedCategory: result.data!.suggestedCategory,
                note: result.data!.notes,
              }
            : {
                rejectedAt: new Date(),
                status: "rejected",
                note: result.message,
              }),
        },
      })
    })

    logger.info({ userId, aiExtractionId, tokenUsage }, "process-email: completed")

    return { message: "ok" }
  },
)
