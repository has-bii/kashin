import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma"
import { EmailProcessorService } from "../email-processor/service"
import { GmailService } from "../gmail/service"
import { inngest } from "./client"

type ProcessEmailEventData = { aiExtractionId: string; userId: string }

export const INNGEST_FUNCTION_EVENTS = {
  processEmail: {
    key: "email/process.email",
    sendEvent: async (data: ProcessEmailEventData) => {
      return inngest.send({
        name: "email/process.email",
        data,
      })
    },
  },
}

export const processEmail = inngest.createFunction(
  {
    id: "process-email",
    concurrency: {
      key: "event.data.userId",
      limit: 1,
    },
    triggers: {
      event: INNGEST_FUNCTION_EVENTS.processEmail.key,
    },
    retries: 0,
  },
  async ({ event, step }) => {
    const { userId, aiExtractionId } = event.data as ProcessEmailEventData

    // Check if exists
    const record = await step.run("check-exist", async () => {
      try {
        const data = await prisma.aiExtraction.findUnique({
          where: { id: aiExtractionId },
          select: { id: true, gmailMessageId: true },
        })

        if (!data) throw new ReferenceError("Email not found")

        return data
      } catch (error) {
        await prisma.aiExtraction.update({
          where: { id: aiExtractionId },
          data: {
            status: "failed",
            finishedAt: new Date(),
            errorMessage:
              error instanceof ReferenceError ? error.message : "Failed to check if email exists",
          },
          select: null,
        })
        throw error
      }
    })

    // Fetching Email
    const rawEmail = await step.run("fetching-email", async () => {
      try {
        // Update status
        await prisma.aiExtraction.update({
          where: { id: aiExtractionId },
          data: { status: "processing", processedAt: new Date() },
          select: null,
        })

        // Check Google Account
        const accessToken = await auth.api
          .getAccessToken({
            body: { userId, providerId: "google" },
          })
          .then((res) => res.accessToken)
          .catch(() => null)

        if (!accessToken) throw new ReferenceError("Your account hasn't linked to Google account")

        // Fetching Email
        const { data } = await GmailService.fetchEmailByMessageId(
          accessToken,
          record.gmailMessageId,
        )

        return data
      } catch (error) {
        await prisma.aiExtraction.update({
          where: { id: aiExtractionId },
          data: {
            status: "failed",
            finishedAt: new Date(),
            errorMessage:
              error instanceof ReferenceError ? error.message : "Failed to getting email",
          },
          select: null,
        })
        throw new Error("Failed to process email: ", { cause: error })
      }
    })

    // Parsing Email
    const parsedEmail = await step.run("parsing-email", async () => {
      try {
        const data = await EmailProcessorService.parseEmail(rawEmail)

        // Update record
        await prisma.aiExtraction.update({
          where: { id: aiExtractionId },
          data: {
            emailFrom: data.emailFrom,
            emailSubject: data.emailSubject,
            emailReceivedAt: data.emailReceivedAt,
            emailText: data.emailText,
            emailHtml: data.emailHtml,
          },
          select: null,
        })

        // Check email body
        if (!data.emailText && !data.emailHtml) {
          throw new ReferenceError("Failed to parse email body")
        }

        // Check email subject
        if (!data.emailSubject) {
          throw new ReferenceError("Failed to parse email subject")
        }

        return data
      } catch (error) {
        await prisma.aiExtraction.update({
          where: { id: aiExtractionId },
          data: {
            status: "failed",
            finishedAt: new Date(),
            errorMessage:
              error instanceof ReferenceError ? error.message : "Failed to getting email",
          },
          select: null,
        })
        throw new Error("Failed to process email: ", { cause: error })
      }
    })

    // Process
    const { result, tokenUsage } = await step.run("analyze-email", async () => {
      try {
        return await EmailProcessorService.processEmail({
          userId,
          aiExtractionId,
          fromAddress: parsedEmail.emailFrom,
          subject: parsedEmail.emailSubject!,
          text: parsedEmail.emailText,
          html: parsedEmail.emailHtml,
          date: parsedEmail.emailReceivedAt,
        })
      } catch (error) {
        await prisma.aiExtraction.update({
          where: { id: aiExtractionId },
          data: {
            status: "failed",
            finishedAt: new Date(),
            errorMessage: error instanceof Error ? error.message : "Failed to analyze email",
          },
          select: null,
        })
        throw new Error("Failed to analyze email: ", { cause: error })
      }
    })

    // Update to the database
    await step.run("update-database", async () => {
      // Check if category and bankAccount exist
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

      await prisma.aiExtraction.update({
        where: { id: aiExtractionId },
        select: null,
        data: {
          tokenUsage,
          finishedAt: new Date(),
          aiResponse: JSON.stringify(result),
          ...(result.isTransaction && result.data
            ? {
                status: "waitingApproval",
                extractedType: result.data?.type,
                extractedMerchant: result.data?.merchant,
                extractedAmount: result.data?.amount,
                extractedBankAccountId: bankAccount?.id,
                extractedCategoryId: category?.id,
                extractedCurrency: result.data.currency,
                extractedDate: result.data.date,
                confidenceScore: result.data.confidence,
                suggestedCategory: result.data.suggestedCategory,
                note: result.data.notes,
              }
            : {
                rejectedAt: new Date(),
                status: "rejected",
                note: result.message,
              }),
        },
      })
    })

    return { message: "ok" }
  },
)
