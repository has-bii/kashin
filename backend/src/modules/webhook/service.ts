import { logger } from "../../lib/logger"
import { prisma } from "../../lib/prisma"
import { qstash } from "../../lib/qstash"
import { status } from "elysia"
import { OAuth2Client } from "google-auth-library"
import { ENV } from "../../config/env"

export abstract class WebhookService {
  private static client = new OAuth2Client()
  private static SERVICE_ACCOUNT_CREDENTIALS = JSON.parse(ENV.GOOGLE.serviceAccountCredential)
  private static SERVICE_ACCOUNT_EMAIL = this.SERVICE_ACCOUNT_CREDENTIALS.client_email

  static async handleGmailWebhook(token: string, request: Request) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: "https://blaming-purple-evolve.ngrok-free.dev/api/webhook/gmail",
      })

      const payload = ticket.getPayload()
      if (payload?.email !== this.SERVICE_ACCOUNT_EMAIL) {
        return status(403, "Invalid Service Account")
      }

      const body = await request.json()

      const decodedData = JSON.parse(Buffer.from(body.message.data, "base64").toString())

      const { emailAddress, historyId } = decodedData

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
        url: `${ENV.SERVER.backendUrl}/api/webhook/process-email`,
        body: { userId: userAccount.userId, historyId },
      })

      return status(200, { received: true })
    } catch (error) {
      logger.error({ err: error }, "Webhook error")
      return status(500)
    }
  }
}
