import { ENV } from "../../config/env"
import { createError } from "../../global/error"
import { auth } from "../../lib/auth"
import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { qstash } from "../../lib/qstash"
import { sendProcessEmailEvent } from "../inngest/events"
import type { GetMessagesQuery, ImportMessagesBody, UpdateWatchFiltersBody } from "./dto"
import { InternalServerError } from "elysia"
import { gmail_v1, google } from "googleapis"

export abstract class GmailService {
  static async getMessages(userId: string, query: GetMessagesQuery) {
    const accessToken = await auth.api
      .getAccessToken({ body: { userId, providerId: "google" } })
      .then((res) => res.accessToken)
      .catch(() => null)

    if (!accessToken) createError("bad_request", "Your account is not linked to a Google account")

    const gmail = this.createGmailClient(accessToken!)

    let q = "category:primary"
    if (query.before) q += ` before:${Math.floor(new Date(query.before).getTime() / 1000)}`
    if (query.after) q += ` after:${Math.floor(new Date(query.after).getTime() / 1000)}`

    const response = await gmail.users.messages.list({
      userId: "me",
      q,
      maxResults: 50,
      pageToken: query.pageToken,
    })

    const pageToken = response.data.nextPageToken || undefined

    if (!response.data.messages) throw new InternalServerError("Failed to get email from Gmail")

    const listMessagesIds = response.data.messages.filter((message) => !!message.id)

    const responses = await Promise.all(
      listMessagesIds.map((message) =>
        gmail.users.messages.get({ id: message.id!, userId: "me", format: "metadata" }),
      ),
    )

    const messages = responses.map((message) => ({
      id: message.data.id,
      ...this.parseEmailMetadata(message.data),
    }))

    return { messages, pageToken }
  }

  static async importMessages(userId: string, body: ImportMessagesBody) {
    if (body.messageIds.length <= 0 || body.messageIds.length > 50)
      createError("bad_request", "Email is required and must be less than 50")

    const accessToken = await auth.api
      .getAccessToken({ body: { userId, providerId: "google" } })
      .then((res) => res.accessToken)
      .catch(() => null)
    if (!accessToken) createError("bad_request", "Your account is not linked to a Google account")

    const gmail = this.createGmailClient(accessToken!)
    const metadataResults = await Promise.allSettled(
      body.messageIds.map((id) =>
        gmail.users.messages.get({ id, userId: "me", format: "metadata" }),
      ),
    )

    const settled = body.messageIds.map((gmailMessageId, i) => ({
      gmailMessageId,
      result: metadataResults[i],
    }))

    const successes = settled.filter(
      (
        s,
      ): s is typeof s & {
        result: PromiseFulfilledResult<Awaited<ReturnType<typeof gmail.users.messages.get>>>
      } => s.result.status === "fulfilled",
    )
    const fetchFailureCount = settled.length - successes.length

    const created = await prisma.aiExtraction.createManyAndReturn({
      skipDuplicates: true,
      data: successes.map(({ gmailMessageId, result }) => {
        const meta = GmailService.parseEmailMetadata(result.value.data)
        return {
          userId,
          gmailMessageId,
          status: "pending",
          emailFrom: meta.from ?? "",
          emailSubject: meta.subject ?? "",
          emailSnippet: meta.snippet ?? "",
          emailReceivedAt: meta.date ? new Date(meta.date) : null,
        }
      }),
      select: { id: true, userId: true },
    })

    if (created.length > 0) {
      try {
        await Promise.all(
          created.map(({ id, userId }) =>
            sendProcessEmailEvent({
              aiExtractionId: id,
              userId,
            }),
          ),
        )
      } catch (err) {
        await prisma.aiExtraction.deleteMany({
          where: { id: { in: created.map((r) => r.id) } },
        })
        logger.error({ err }, "Failed to send event to Inngest")
        createError("internal_server", "Failed to queue emails for processing. Please try again.")
      }
    }

    return {
      total: body.messageIds.length,
      pendingImportEmail: created.length,
      skippedImportEmail: successes.length - created.length,
      fetchFailureCount,
    }
  }

  static async getWatchConfig(userId: string) {
    const select = {
      enabled: true,
      historyId: true,
      expiresAt: true,
      subjectKeywords: true,
      gmailLabels: true,
    } as const

    const config = await prisma.gmailWatchConfig.findUnique({ where: { userId }, select })
    if (config) return config

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true },
    })
    return prisma.gmailWatchConfig.create({
      data: { userId, gmailAddress: user.email },
      select,
    })
  }

  static async updateFilters(userId: string, body: UpdateWatchFiltersBody) {
    await prisma.gmailWatchConfig.upsert({
      where: { userId },
      create: {
        userId,
        gmailAddress: "",
        ...(body.subjectKeywords !== undefined && { subjectKeywords: body.subjectKeywords }),
        ...(body.gmailLabels !== undefined && { gmailLabels: body.gmailLabels }),
      },
      update: {
        ...(body.subjectKeywords !== undefined && { subjectKeywords: body.subjectKeywords }),
        ...(body.gmailLabels !== undefined && { gmailLabels: body.gmailLabels }),
      },
    })

    return this.getWatchConfig(userId)
  }

  static async enableWatch(userId: string) {
    const config = await prisma.gmailWatchConfig.findUnique({
      where: { userId },
      select: { subjectKeywords: true, gmailLabels: true },
    })

    const hasFilters =
      (config?.subjectKeywords.length ?? 0) > 0 || (config?.gmailLabels.length ?? 0) > 0

    if (!hasFilters)
      createError("bad_request", "Configure at least one filter before enabling watch")

    const accessToken = await auth.api
      .getAccessToken({ body: { userId, providerId: "google" } })
      .then((r) => r.accessToken)
      .catch(() => null)
    if (!accessToken) createError("bad_request", "Your account is not linked to a Google account")

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
    const gmailAddress = user!.email

    const gmail = this.createGmailClient(accessToken!)
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
    let qstashMessageId: string
    try {
      const scheduled = await qstash.publishJSON({
        url: `${ENV.SERVER.url}/api/webhook/gmail-watch-renew`,
        body: { userId },
        notBefore,
      })
      qstashMessageId = scheduled.messageId
    } catch (err) {
      await gmail.users.stop({ userId: "me" })
      throw err
    }

    await prisma.gmailWatchConfig.upsert({
      where: { userId },
      create: {
        userId,
        gmailAddress,
        enabled: true,
        historyId,
        expiresAt,
        qstashMessageId,
      },
      update: {
        gmailAddress,
        enabled: true,
        historyId,
        expiresAt,
        qstashMessageId,
      },
    })

    return { enabled: true, expiresAt }
  }

  static async disableWatch(userId: string) {
    const config = await prisma.gmailWatchConfig.findUnique({
      where: { userId },
      select: { qstashMessageId: true, enabled: true },
    })

    if (!config || !config.enabled) return { enabled: false }

    if (config.qstashMessageId) {
      await qstash.messages.cancel(config.qstashMessageId).catch(() => {})
    }

    const accessToken = await auth.api
      .getAccessToken({ body: { userId, providerId: "google" } })
      .then((r) => r.accessToken)
      .catch(() => null)

    if (accessToken) {
      const gmail = this.createGmailClient(accessToken)
      await gmail.users.stop({ userId: "me" }).catch(() => {})
    }

    await prisma.gmailWatchConfig.update({
      where: { userId },
      data: { enabled: false, historyId: null, expiresAt: null, qstashMessageId: null },
    })

    return { enabled: false }
  }

  static async createExtractionsAndQueue(
    userId: string,
    messages: Array<{
      gmailMessageId: string
      emailFrom: string
      emailSubject: string
      emailSnippet: string
      emailReceivedAt: Date | null
    }>,
  ): Promise<number> {
    const existing = await prisma.aiExtraction.findMany({
      where: { userId, status: { in: ["pending", "processing"] } },
      select: { id: true },
    })
    if (existing.length > 0) return 0

    const created = await prisma.aiExtraction.createMany({
      skipDuplicates: true,
      data: messages.map((m) => ({
        userId,
        gmailMessageId: m.gmailMessageId,
        status: "pending" as const,
        emailFrom: m.emailFrom,
        emailSubject: m.emailSubject,
        emailSnippet: m.emailSnippet,
        emailReceivedAt: m.emailReceivedAt,
      })),
    })

    if (created.count > 0) {
      const rows = await prisma.aiExtraction.findMany({
        where: {
          userId,
          gmailMessageId: { in: messages.map((m) => m.gmailMessageId) },
          status: "pending",
        },
        select: { id: true, userId: true },
      })
      try {
        await Promise.all(
          rows.map(({ id, userId: uid }) =>
            sendProcessEmailEvent({ aiExtractionId: id, userId: uid }),
          ),
        )
      } catch {
        await prisma.aiExtraction.deleteMany({ where: { id: { in: rows.map((r) => r.id) } } })
      }
    }

    return created.count
  }

  static async getLabels(userId: string) {
    const accessToken = await auth.api
      .getAccessToken({ body: { userId, providerId: "google" } })
      .then((res) => res.accessToken)
      .catch(() => null)

    if (!accessToken) return []

    const gmail = this.createGmailClient(accessToken)
    const response = await gmail.users.labels.list({ userId: "me" })

    return (
      response.data.labels?.map((label) => ({
        id: label.id!,
        name: label.name!,
      })) ?? []
    )
  }

  static createGmailClient(accessToken: string) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })
    return google.gmail({ version: "v1", auth })
  }

  static async listMessageIds(gmail: gmail_v1.Gmail, after: Date, before: Date): Promise<string[]> {
    try {
      const afterTs = Math.floor(after.getTime() / 1000)
      const beforeTs = Math.floor(before.getTime() / 1000)

      const messageIds: string[] = []
      let pageToken: string | undefined

      do {
        const response = await gmail.users.messages.list({
          userId: "me",
          q: `after:${afterTs} before:${beforeTs} category:primary`,
          maxResults: 500,
          pageToken,
        })

        for (const msg of response.data.messages || []) {
          if (msg.id) messageIds.push(msg.id)
        }

        pageToken = response.data.nextPageToken ?? undefined
      } while (pageToken)

      return messageIds
    } catch (error) {
      logger.error({ err: error }, "Gmail API error")
      throw new InternalServerError("Failed to fetch emails from Gmail")
    }
  }

  static async fetchEmailByMessageId(accessToken: string, messageId: string) {
    const gmail = this.createGmailClient(accessToken)
    return gmail.users.messages.get({ userId: "me", id: messageId, format: "raw" })
  }

  static parseEmailMetadata(email: gmail_v1.Schema$Message) {
    const subject = email.payload?.headers?.find((acc) => acc.name === "Subject")?.value || null
    const from = email.payload?.headers?.find((acc) => acc.name === "From")?.value || null
    const date = email.payload?.headers?.find((acc) => acc.name === "Date")?.value || null
    const snippet = email.snippet || null
    return { subject, from, date, snippet }
  }
}
