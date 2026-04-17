import { createError } from "../../global/error"
import { auth } from "../../lib/auth"
import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { INNGEST_FUNCTION_EVENTS } from "../inngest/functions"
import { InternalServerError, status } from "elysia"
import { gmail_v1, google } from "googleapis"
import type { GetMessagesQuery, ImportMessagesBody } from "./dto"
import { ENV } from "../../config/env"

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

    const existing = await prisma.aiExtraction.findMany({
      where: { userId, status: { in: ["pending", "processing"] } },
      select: { id: true },
    })

    if (existing.length > 0)
      createError("bad_request", "The system is still processing a previous import. Please wait until it finishes")

    let imported = 0

    await prisma.$transaction(async (tx) => {
      const data = await tx.aiExtraction.createManyAndReturn({
        skipDuplicates: true,
        data: body.messageIds.map((gmailMessageId) => ({ userId, gmailMessageId, status: "pending" })),
        select: { id: true, userId: true },
      })

      await Promise.all(
        data.map(({ id, userId }) =>
          INNGEST_FUNCTION_EVENTS.processEmail.sendEvent({ aiExtractionId: id, userId }),
        ),
      )

      imported = data.length
    })

    return {
      pendingImportEmail: imported,
      skippedImportEmail: body.messageIds.length - imported,
    }
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

  private static parseEmailMetadata(email: gmail_v1.Schema$Message) {
    const subject = email.payload?.headers?.find((acc) => acc.name === "Subject")?.value || null
    const from = email.payload?.headers?.find((acc) => acc.name === "From")?.value || null
    const date = email.payload?.headers?.find((acc) => acc.name === "Date")?.value || null
    const snippet = email.snippet || null
    return { subject, from, date, snippet }
  }

  private static async setupGmailWatch(accessToken: string, refreshToken: string) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
    const gmail = google.gmail({ version: "v1", auth })

    try {
      const response = await gmail.users.watch({
        userId: "me",
        requestBody: {
          topicName: ENV.GOOGLE.topicName,
          labelIds: ["INBOX"],
          labelFilterBehavior: "INCLUDE",
        },
      })
      return response.data
    } catch (error) {
      logger.error({ err: error }, "Failed to setup Gmail watch")
      return status(500)
    }
  }
}
