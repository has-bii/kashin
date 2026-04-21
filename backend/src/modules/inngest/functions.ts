import { NonRetriableError } from "inngest"
import { auth } from "../../lib/auth"
import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { EmailProcessorService } from "../email-processor/service"
import { GmailService } from "../gmail/service"
import { inngest } from "./client"
import { EMAIL_EVENTS, type ProcessEmailEventData } from "./events"

async function checkExists(aiExtractionId: string) {
  const data = await prisma.aiExtraction.findUnique({
    where: { id: aiExtractionId },
    select: { id: true, gmailMessageId: true },
  })
  if (!data) throw new NonRetriableError("Email not found")
  return data
}

async function fetchRawEmail(
  userId: string,
  aiExtractionId: string,
  gmailMessageId: string,
) {
  await prisma.aiExtraction.update({
    where: { id: aiExtractionId },
    data: { status: "processing", processedAt: new Date() },
  })

  const accessToken = await auth.api
    .getAccessToken({ body: { userId, providerId: "google" } })
    .then((res) => res.accessToken)
    .catch(() => null)

  if (!accessToken) throw new NonRetriableError("Your account hasn't linked to Google account")

  const { data } = await GmailService.fetchEmailByMessageId(accessToken, gmailMessageId).catch(
    (error) => {
      logger.error({ userId, aiExtractionId, error }, "process-email: failed to fetch email")
      throw new NonRetriableError("Failed to fetch email", { cause: error })
    },
  )

  return data
}

interface ParsedEmailResult {
  emailFrom: string
  emailSubject?: string
  emailText?: string
  emailHtml?: string
  emailReceivedAt?: Date | string
}

async function parseAndStoreEmail(
  rawEmail: Awaited<ReturnType<typeof fetchRawEmail>>,
  aiExtractionId: string,
  userId: string,
): Promise<ParsedEmailResult> {
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
}

async function analyzeEmail(
  userId: string,
  aiExtractionId: string,
  parsedEmail: ParsedEmailResult,
) {
  return EmailProcessorService.processEmail({
    userId,
    aiExtractionId,
    fromAddress: parsedEmail.emailFrom,
    subject: parsedEmail.emailSubject!,
    text: parsedEmail.emailText,
    html: parsedEmail.emailHtml,
    date: parsedEmail.emailReceivedAt != null ? String(parsedEmail.emailReceivedAt) : undefined,
  }).catch((error) => {
    logger.error({ userId, aiExtractionId, error }, "process-email: analyze-email failed")
    throw new Error("Failed to analyze email", { cause: error })
  })
}

async function finalizeExtraction(
  aiExtractionId: string,
  result: Awaited<ReturnType<typeof analyzeEmail>>["result"],
  tokenUsage: Awaited<ReturnType<typeof analyzeEmail>>["tokenUsage"],
) {
  const [category, bankAccount] = await Promise.all([
    result.data?.categoryId
      ? prisma.category.findUnique({ where: { id: result.data.categoryId }, select: { id: true } })
      : null,
    result.data?.bankAccountId
      ? prisma.bankAccount.findUnique({
          where: { id: result.data.bankAccountId },
          select: { id: true },
        })
      : null,
  ])

  const isApproval = result.isTransaction && result.data != null

  await prisma.aiExtraction.update({
    where: { id: aiExtractionId },
    data: {
      tokenUsage,
      finishedAt: new Date(),
      aiResponse: JSON.stringify(result),
      ...(isApproval && result.data
        ? {
            status: "waitingApproval",
            extractedType: result.data.type,
            extractedMerchant: result.data.merchant,
            extractedAmount: result.data.amount,
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
}

export const processEmail = inngest.createFunction(
  {
    id: "process-email",
    concurrency: { key: "event.data.userId", limit: 1 },
    debounce: { period: "5s" },
    triggers: { event: EMAIL_EVENTS.processEmail },
    retries: 2,
    cancelOn: [
      {
        event: EMAIL_EVENTS.cancelEmail,
        if: "async.data.aiExtractionId == event.data.aiExtractionId",
      },
    ],
    onFailure: async ({ error, event, step }) => {
      const { aiExtractionId } = event.data.event.data as ProcessEmailEventData
      await step.run("handle-failure", () =>
        prisma.aiExtraction.updateMany({
          where: { id: aiExtractionId },
          data: { status: "failed", finishedAt: new Date(), errorMessage: error.message },
        }),
      )
    },
  },
  async ({ event, step }) => {
    const { userId, aiExtractionId } = event.data as ProcessEmailEventData

    logger.info({ userId, aiExtractionId }, "process-email: starting")

    const record = await step.run("check-exist", () => checkExists(aiExtractionId))

    const rawEmail = await step.run("fetch-email", () =>
      fetchRawEmail(userId, aiExtractionId, record.gmailMessageId),
    )

    const parsedEmail = await step.run("parse-email", () =>
      parseAndStoreEmail(rawEmail, aiExtractionId, userId),
    )

    const { result, tokenUsage } = await step.run("analyze-email", () =>
      analyzeEmail(userId, aiExtractionId, parsedEmail),
    )

    await step.run("finalize", () => finalizeExtraction(aiExtractionId, result, tokenUsage))

    logger.info({ userId, aiExtractionId, tokenUsage }, "process-email: completed")

    return { message: "ok" }
  },
)
