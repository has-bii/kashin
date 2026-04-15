import { InternalServerError, status } from "elysia"
import { gmail_v1, google } from "googleapis"

export abstract class GmailService {
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
      console.error("Gmail API Error:", error)
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
      console.error("Failed to setup Gmail watch:", error)
      return status(500)
    }
  }
}
