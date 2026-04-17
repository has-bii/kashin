import { BadRequest } from "../../global/error"
import { auth } from "../../lib/auth"
import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { INNGEST_FUNCTION_EVENTS } from "../inngest/functions"
import { getMessagesQuery, importMessagesBody } from "./query"
import { InternalServerError, status } from "elysia"
import { gmail_v1, google } from "googleapis"

type GetMessagesQuery = (typeof getMessagesQuery)["static"]
type ImportMessagesBody = (typeof importMessagesBody)["static"]

export abstract class GmailService {
  /* ------------------------------ API Endpoints ----------------------------- */
  static async getMessages(userId: string, query: GetMessagesQuery) {
    const accessToken = await auth.api
      .getAccessToken({
        body: { userId, providerId: "google" },
      })
      .then((res) => res.accessToken)
      .catch(() => null)

    if (!accessToken) throw new BadRequest("Your account hasn't linked to Google account")

    const gmail = this.createGmailClient(accessToken)

    let q = "category:primary"

    if (query.before) {
      q += ` before:${Math.floor(new Date(query.before).getTime() / 1000)}`
    }

    if (query.after) {
      q += ` after:${Math.floor(new Date(query.after).getTime() / 1000)}`
    }

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
      listMessagesIds.map((message) => {
        return gmail.users.messages.get({
          id: message.id!,
          userId: "me",
          format: "metadata",
        })
      }),
    )

    const messages = responses.map((message) => ({
      id: message.data.id,
      ...this.parseEmailMetadata(message.data),
    }))

    return { messages, pageToken }
  }

  static async importMessages(userId: string, body: ImportMessagesBody) {
    // Check if gmailMessageIds is empty and > 50
    if (body.messageIds.length <= 0 || body.messageIds.length > 50)
      throw new BadRequest("Email is required and must be less than 50")

    // Get Google access token
    const accessToken = await auth.api
      .getAccessToken({
        body: { userId, providerId: "google" },
      })
      .then((res) => res.accessToken)
      .catch(() => null)
    if (!accessToken) throw new BadRequest("Your account hasn't linked to Google account")

    // Check if any pending, pr
    const existing = await prisma.aiExtraction.findMany({
      where: { userId, status: { in: ["pending", "processing"] } },
      select: {
        id: true,
      },
    })

    if (existing.length > 0)
      throw new BadRequest(
        "The system is still processing the previous import yet. Wait until finish",
      )

    let imported = 0

    await prisma.$transaction(async (tx) => {
      // Insert gmailMessageIds
      const data = await tx.aiExtraction.createManyAndReturn({
        skipDuplicates: true,
        data: body.messageIds.map((gmailMessageId) => ({
          userId,
          gmailMessageId,
          status: "pending",
        })),
        select: {
          id: true,
          userId: true,
        },
      })

      // Sending event
      await Promise.all(
        data.map(({ id, userId }) =>
          INNGEST_FUNCTION_EVENTS.processEmail.sendEvent({
            aiExtractionId: id,
            userId,
          }),
        ),
      )

      imported = data.length
    })

    return {
      pendingImportEmail: imported,
      skippedImportEmail: body.messageIds.length - imported,
    }
  }

  /* ---------------------------- Public Functions ---------------------------- */
  static createGmailClient(accessToken: string) {
    const auth = new google.auth.OAuth2()

    auth.setCredentials({
      access_token: accessToken,
    })

    const gmail = google.gmail({ version: "v1", auth })

    return gmail
  }

  static async listMessageIds(gmail: gmail_v1.Gmail, after: Date, before: Date): Promise<string[]> {
    try {
      // Gmail query 'after' and 'before' use seconds, not milliseconds
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

        const messages = response.data.messages || []

        // Extract IDs and ensure they are strings
        for (const msg of messages) {
          if (msg.id) messageIds.push(msg.id)
        }

        pageToken = response.data.nextPageToken ?? undefined
      } while (pageToken)

      return messageIds
    } catch (error) {
      // Logging the actual error object helps with debugging 401 vs 429 errors
      logger.error({ err: error }, "Gmail API error")
      throw new InternalServerError("Failed to fetch emails from Gmail")
    }
  }

  static async fetchEmailByMessageId(accessToken: string, messageId: string) {
    const gmail = this.createGmailClient(accessToken)

    return gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "raw",
    })
  }

  /* ---------------------------- Private functions --------------------------- */
  private static parseEmailMetadata(email: gmail_v1.Schema$Message) {
    const subject = email.payload?.headers?.find((acc) => acc.name === "Subject")?.value || null
    const from = email.payload?.headers?.find((acc) => acc.name === "From")?.value || null
    const date = email.payload?.headers?.find((acc) => acc.name === "Date")?.value || null
    const snippet = email.snippet || null

    return { subject, from, date, snippet }
  }

  private static async setupGmailWatch(accessToken: string, refreshToken: string) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    const gmail = google.gmail({ version: "v1", auth })

    try {
      const response = await gmail.users.watch({
        userId: "me",
        requestBody: {
          topicName: process.env.TOPIC_NAME,
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
