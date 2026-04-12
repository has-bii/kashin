import { prisma } from "../../lib/prisma"
import { NotFoundError, status } from "elysia"
import { google } from "googleapis"

export abstract class GmailService {
  static async watchManually(userId: string) {
    const user = await prisma.account.findFirst({
      where: { userId, providerId: "google" },
    })

    if (!user) throw new NotFoundError("Pengguna tidak ditemukan")

    if (!user.accessToken || !user.refreshToken) {
      return status(400, "Google account not linked yet!")
    }

    return await this.setupGmailWatch(user.accessToken, user.refreshToken)
  }

  private static async setupGmailWatch(accessToken: string, refreshToken: string) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    const gmail = google.gmail({ version: "v1", auth })

    try {
      // 3. Call the watch method
      const response = await gmail.users.watch({
        userId: "me",
        requestBody: {
          // Must be the fully qualified topic name
          topicName: process.env.TOPIC_NAME,
          labelIds: ["INBOX"],
          labelFilterBehavior: "INCLUDE",
        },
      })

      const data = response.data

      console.log(data)

      return data
    } catch (error) {
      console.error("Failed to setup Gmail watch:", error)
      return status(500)
    }
  }
}
