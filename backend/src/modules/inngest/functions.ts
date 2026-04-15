import { auth } from "../../lib/auth"
import { AiExtractionService } from "../ai-extraction/service"
import { EmailImportService } from "../email-import/service"
import { EmailLogService } from "../email-log/service"
import { EmailProcessorService } from "../email-processor/service"
import { GmailService } from "../gmail/service"
import { inngest } from "./client"

type FetchEmailEventData = { userId: string; messageId: string; emailImportId: string }
type ProcessEmailEventData = { emailLogId: string; emailImportId: string }

export const INNGEST_FUNCTION_EVENTS = {
  fetchEmail: {
    key: "email/fetch.email",
    sendEvent: async (data: FetchEmailEventData) => {
      return inngest.send({
        name: "email/fetch.email",
        data,
      })
    },
  },
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

export const fetchEmail = inngest.createFunction(
  {
    id: "fetch-email",
    concurrency: {
      key: "event.data.userId",
      limit: 1,
    },
    triggers: {
      event: INNGEST_FUNCTION_EVENTS.fetchEmail.key,
    },
  },
  async ({ event, step }) => {
    const { userId, messageId, emailImportId } = event.data as FetchEmailEventData

    // Get gmail accessToken
    const credentials = await step.run("get-access-and-refresh-token", async () => {
      try {
        const { accessToken } = await auth.api.getAccessToken({
          body: {
            providerId: "google",
            userId,
          },
        })
        return accessToken
      } catch (error) {
        await EmailImportService.updateEmailImportProcessing(emailImportId, "failed")
        throw new Error("Failed to get google credentials ")
      }
    })

    // Get email
    const emailData = await step.run("fetch-email", async () => {
      try {
        const { data } = await GmailService.fetchEmailByMessageId(credentials, messageId)

        if (!data.raw) throw new Error("Fetched raw email but empty")

        return data
      } catch (error) {
        await EmailImportService.updateEmailImportProcessing(emailImportId, "failed")
        throw new Error("Failed to fetch email")
      }
    })

    // Parse email
    const parseEmail = await step.run("parse-email", async () => {
      try {
        const data = await EmailProcessorService.parseEmail(emailData)

        return data
      } catch (error) {
        await EmailImportService.updateEmailImportProcessing(emailImportId, "failed")
        throw new Error("Failed to parse email")
      }
    })

    // Update to the database & Send inngest email/process.email
    await step.run("update-database", async () => {
      await Promise.all([
        EmailLogService.insert({
          user: {
            connect: {
              id: userId,
            },
          },
          gmailMessageId: messageId,
          subject: parseEmail.subject,
          fromAddress: parseEmail.fromAddress || "Unknown",
          rawBody: parseEmail.body,
          receivedAt: parseEmail.receivedAt,
          status: "received",
        }),
        EmailImportService.updateEmailImportProcessing(emailImportId, "received"),
      ])
    })

    return { message: "ok" }
  },
)

export const processEmail = inngest.createFunction(
  {
    id: "process-email",
    concurrency: {
      key: "event.data.emailLogId",
      limit: 1,
    },
    triggers: {
      event: INNGEST_FUNCTION_EVENTS.processEmail.key,
    },
  },
  async ({ event, step }) => {
    const { emailLogId, emailImportId } = event.data as ProcessEmailEventData

    // Get email
    const email = await step.run("get-email", async () => {
      try {
        const data = await EmailLogService.findByid(emailLogId)

        if (!data) throw new ReferenceError("Email not found")

        if (!data.rawBody) throw new ReferenceError("Email body is empty")

        if (!data.subject) throw new ReferenceError("Email subject is empty")

        return data
      } catch (error) {
        await Promise.all([
          EmailImportService.updateEmailImportAnalyzing(emailImportId, "failed"),
          EmailLogService.update(emailLogId, {
            status: "failed",
            errorMessage: error instanceof ReferenceError ? error.message : "Unknown error",
          }),
        ])
        throw error
      }
    })

    // Process Email
    const { result, tokenUsage } = await step.run("process-email", async () => {
      try {
        await EmailLogService.update(emailLogId, {
          status: "analyzing",
        })

        return await EmailProcessorService.processEmail({
          userId: email.userId,
          subject: email.subject!,
          fromAddress: email.fromAddress,
          body: email.rawBody!,
        })
      } catch (error) {
        await Promise.all([
          EmailLogService.update(emailLogId, {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          }),
          EmailImportService.updateEmailImportAnalyzing(emailImportId, "failed"),
        ])
        throw new Error("Failed to process email: ")
      }
    })

    // Update to the database
    await step.run("update-database", async () => {
      await Promise.all([
        EmailImportService.updateEmailImportAnalyzing(emailImportId, "processed"),
        EmailLogService.update(emailLogId, {
          status: "completed",
        }),
        AiExtractionService.insert({
          user: {
            connect: {
              id: email.userId,
            },
          },
          emailLog: {
            connect: {
              id: BigInt(emailLogId),
            },
          },
          status: result.isTransaction ? "pending" : "rejected",
          extractedType: result.data?.type,
          extractedAmount: result.data?.amount,
          extractedCurrency: result.data?.currency,
          extractedDate: result.data?.date,
          extractedNotes: result.data?.notes,
          extractedCategory: result.data?.categoryId
            ? { connect: { id: result.data.categoryId } }
            : undefined,
          confidenceScore: result.data?.confidence,
          notes: result.message,
          suggestedCategory: result.data?.suggestedCategory,
          tokenUsage,
        }),
      ])
    })

    return { message: "ok" }
  },
)
