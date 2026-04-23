import { ENV } from "../../config/env"
import { QuotaExceededError } from "../../global/error"
import { auth } from "../../lib/auth"
import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { qstash } from "../../lib/qstash"
import { AiUsageService } from "../ai-usage/service"
import { GmailService } from "../gmail/service"
import { status } from "elysia"
import { OAuth2Client } from "google-auth-library"

export abstract class WebhookService {
  private static client = new OAuth2Client()
  private static SERVICE_ACCOUNT_CREDENTIALS = JSON.parse(ENV.GOOGLE.serviceAccountCredential)
  private static SERVICE_ACCOUNT_EMAIL = this.SERVICE_ACCOUNT_CREDENTIALS.client_email

  static async handleGmailWebhook(token: string, request: Request) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: ENV.GOOGLE.gmailAudience,
      })

      const payload = ticket.getPayload()
      if (payload?.email !== this.SERVICE_ACCOUNT_EMAIL) {
        return status(403, "Invalid Service Account")
      }

      const body = await request.json()

      const decodedData = JSON.parse(Buffer.from(body.message.data, "base64").toString())

      const { emailAddress } = decodedData

      // Find the user by their Google email
      const userAccount = await prisma.account.findFirst({
        where: {
          providerId: "google",
          user: { email: emailAddress },
        },
        include: { user: true },
      })

      if (!userAccount) return status(200) // ack but ignore

      // Queue to QStash for async processing
      await qstash.publishJSON({
        url: `${ENV.SERVER.url}/api/webhook/process-email`,
        body: { userId: userAccount.userId },
      })

      return status(200, { received: true })
    } catch (error) {
      logger.error({ err: error }, "Webhook error")
      return status(500)
    }
  }

  static async handleProcessEmail(userId: string) {
    const config = await prisma.gmailWatchConfig.findUnique({
      where: { userId },
      select: { enabled: true, historyId: true, subjectKeywords: true, gmailLabels: true },
    })
    if (!config || !config.enabled || !config.historyId) return

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId },
      include: { bank: true },
    })

    const accessToken = await auth.api
      .getAccessToken({ body: { userId, providerId: "google" } })
      .then((r) => r.accessToken)
      .catch(() => null)

    if (!accessToken) {
      await prisma.gmailWatchConfig.update({ where: { userId }, data: { enabled: false } })
      return
    }

    const gmail = GmailService.createGmailClient(accessToken)

    let historyData
    try {
      const response = await gmail.users.history.list({
        userId: "me",
        startHistoryId: config.historyId,
        historyTypes: ["messageAdded"],
        labelId: "INBOX",
      })
      historyData = response.data
    } catch (err) {
      logger.error({ err }, "Gmail history fetch failed — disabling watch")
      await prisma.gmailWatchConfig.update({
        where: { userId },
        data: { enabled: false, expiresAt: null, qstashMessageId: null },
      })
      return
    }

    if (historyData.historyId) {
      await prisma.gmailWatchConfig.update({
        where: { userId },
        data: { historyId: historyData.historyId },
      })
    }

    const newMessages =
      historyData.history?.flatMap((h) => h.messagesAdded ?? []).map((m) => m.message!) ?? []
    if (newMessages.length === 0) return

    const metaResults = await Promise.allSettled(
      newMessages.map((m) =>
        gmail.users.messages.get({ userId: "me", id: m.id!, format: "metadata" }),
      ),
    )

    const allowedSenderEmails = new Set(bankAccounts.flatMap((a) => a.bank.email))
    const allowedKeywords = config.subjectKeywords.map((k) => k.toLowerCase())
    const allowedLabelIds = new Set(config.gmailLabels)

    const passing: Array<{
      gmailMessageId: string
      emailFrom: string
      emailSubject: string
      emailSnippet: string
      emailReceivedAt: Date | null
    }> = []

    for (const result of metaResults) {
      if (result.status !== "fulfilled") continue
      const msg = result.value.data
      const meta = GmailService.parseEmailMetadata(msg)
      const msgLabelIds = msg.labelIds ?? []

      const senderEmail = meta.from?.match(/<([^>]+)>/)?.[1] ?? meta.from ?? ""

      const matchesSender = allowedSenderEmails.size > 0 && allowedSenderEmails.has(senderEmail)
      const matchesKeyword =
        allowedKeywords.length > 0 &&
        allowedKeywords.some((k) => (meta.subject ?? "").toLowerCase().includes(k))
      const matchesLabel =
        allowedLabelIds.size > 0 && msgLabelIds.some((l) => allowedLabelIds.has(l))

      if (matchesSender || matchesKeyword || matchesLabel) {
        passing.push({
          gmailMessageId: msg.id!,
          emailFrom: meta.from ?? "",
          emailSubject: meta.subject ?? "",
          emailSnippet: meta.snippet ?? "",
          emailReceivedAt: meta.date ? new Date(meta.date) : null,
        })
      }
    }

    if (passing.length === 0) return

    const allowed: typeof passing = []
    for (const email of passing) {
      try {
        await AiUsageService.assertQuotaAndRecord(userId, "email_extraction")
        allowed.push(email)
      } catch (err) {
        if (err instanceof QuotaExceededError) {
          logger.info({ userId }, "handleProcessEmail: daily quota reached, skipping remaining emails")
          break
        }
        throw err
      }
    }

    if (allowed.length > 0) {
      await GmailService.createExtractionsAndQueue(userId, allowed)
    }
  }

  static async handleGmailWatchRenew(userId: string) {
    const config = await prisma.gmailWatchConfig.findUnique({
      where: { userId },
      select: { enabled: true, qstashMessageId: true },
    })
    if (!config || !config.enabled) return

    const accessToken = await auth.api
      .getAccessToken({ body: { userId, providerId: "google" } })
      .then((r) => r.accessToken)
      .catch(() => null)

    if (!accessToken) {
      await prisma.gmailWatchConfig.update({
        where: { userId },
        data: { enabled: false, expiresAt: null, qstashMessageId: null },
      })
      return
    }

    const gmail = GmailService.createGmailClient(accessToken)
    const watchResponse = await gmail.users.watch({
      userId: "me",
      requestBody: {
        topicName: ENV.GOOGLE.pubsubTopicName,
        labelIds: ["INBOX"],
        labelFilterBehavior: "INCLUDE",
      },
    })

    const historyId = watchResponse.data.historyId!
    const expiresAt = new Date(Number(watchResponse.data.expiration))
    const notBefore = Math.floor((expiresAt.getTime() - 24 * 60 * 60 * 1000) / 1000)

    if (config.qstashMessageId) {
      await qstash.messages.cancel(config.qstashMessageId).catch(() => {})
    }

    const scheduled = await qstash.publishJSON({
      url: `${ENV.SERVER.url}/api/webhook/gmail-watch-renew`,
      body: { userId },
      notBefore,
    })

    await prisma.gmailWatchConfig.update({
      where: { userId },
      data: { historyId, expiresAt, qstashMessageId: scheduled.messageId },
    })
  }
}
