import { status } from "elysia"
import { OAuth2Client } from "google-auth-library"

export abstract class WebhookService {
  private static client = new OAuth2Client()
  private static SERVICE_ACCOUNT_CREDENTIALS = JSON.parse(process.env.SERVICE_ACCOUNT_CREDENTIAL!)
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

      console.log("Before")

      // Process AI
      this.testingPromise()

      console.log("After")

      return status(200, { received: true })
    } catch (error) {
      console.error("Webhook Error: ", error)
      status(500)
    }
  }

  static async testingPromise() {
    const hehe = await new Promise<"hehe">((resolve) =>
      setTimeout(() => {
        resolve("hehe")
      }, 5000),
    )

    console.log(hehe)
  }
}
