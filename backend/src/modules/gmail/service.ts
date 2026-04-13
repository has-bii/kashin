import { prisma } from "../../lib/prisma"
import { NotFoundError, status } from "elysia"
import { google } from "googleapis"
import { EmailProcessorService } from "../email-processor/service"
import { qstash } from "../../lib/qstash"

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

  static async listMessageIds(
    accessToken: string,
    refreshToken: string,
    after: Date,
    before: Date,
  ): Promise<string[]> {
    const gmail = EmailProcessorService.createGmailClient(accessToken, refreshToken)

    const afterStr = after.toISOString().split("T")[0].replace(/-/g, "/")
    const beforeStr = before.toISOString().split("T")[0].replace(/-/g, "/")

    const messageIds: string[] = []
    let pageToken: string | undefined

    do {
      const response = await gmail.users.messages.list({
        userId: "me",
        q: `after:${afterStr} before:${beforeStr}`,
        maxResults: 500,
        pageToken,
      })

      const messages = response.data.messages ?? []
      messageIds.push(...messages.map((m) => m.id!).filter(Boolean))
      pageToken = response.data.nextPageToken ?? undefined
    } while (pageToken)

    return messageIds
  }

  static async fetchMessage(
    accessToken: string,
    refreshToken: string,
    messageId: string,
  ) {
    const gmail = EmailProcessorService.createGmailClient(accessToken, refreshToken)

    const msg = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    })

    return EmailProcessorService.decodeGmailMessage(msg.data)
  }

  static async importEmails(
    userId: string,
    after: string,
    before: string,
  ): Promise<{
    importId: string
    totalEmails: number
    skippedEmails: number
    queued: number
  }> {
    const activeImport = await prisma.emailImport.findFirst({
      where: { userId, status: { in: ["gathering", "processing"] } },
    })
    if (activeImport) {
      throw status(409, "An import is already in progress")
    }

    const emailImport = await prisma.emailImport.create({
      data: {
        userId,
        status: "gathering",
        afterDate: new Date(after),
        beforeDate: new Date(before),
      },
    })

    const account = await prisma.account.findFirst({
      where: { userId, providerId: "google" },
    })
    if (!account?.accessToken) {
      await prisma.emailImport.update({
        where: { id: emailImport.id },
        data: { status: "failed" },
      })
      throw new NotFoundError("Google account not linked")
    }

    const allMessageIds = await this.listMessageIds(
      account.accessToken,
      account.refreshToken!,
      new Date(after),
      new Date(before),
    )

    const existingLogs = await prisma.emailLog.findMany({
      where: { userId, gmailMessageId: { in: allMessageIds } },
      select: { gmailMessageId: true },
    })
    const existingIds = new Set(existingLogs.map((l) => l.gmailMessageId))
    const newMessageIds = allMessageIds.filter((id) => !existingIds.has(id))

    await prisma.emailImport.update({
      where: { id: emailImport.id },
      data: {
        totalEmails: allMessageIds.length,
        skippedEmails: allMessageIds.length - newMessageIds.length,
        status: newMessageIds.length > 0 ? "processing" : "completed",
        completedAt: newMessageIds.length === 0 ? new Date() : undefined,
      },
    })

    for (const messageId of newMessageIds) {
      await qstash.publishJSON({
        url: `${process.env.BACKEND_URL}/api/webhook/process-imported-email`,
        body: { userId, gmailMessageId: messageId, importId: emailImport.id },
      })
    }

    return {
      importId: emailImport.id,
      totalEmails: allMessageIds.length,
      skippedEmails: allMessageIds.length - newMessageIds.length,
      queued: newMessageIds.length,
    }
  }

  static async getImportStatus(userId: string) {
    const activeImport = await prisma.emailImport.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    if (!activeImport) return null

    const totalToProcess = activeImport.totalEmails - activeImport.skippedEmails

    return {
      id: activeImport.id,
      status: activeImport.status,
      afterDate: activeImport.afterDate,
      beforeDate: activeImport.beforeDate,
      totalEmails: activeImport.totalEmails,
      skippedEmails: activeImport.skippedEmails,
      processedEmails: activeImport.processedEmails,
      failedEmails: activeImport.failedEmails,
      remainingEmails: totalToProcess - activeImport.processedEmails - activeImport.failedEmails,
      progress:
        totalToProcess > 0
          ? Math.round((activeImport.processedEmails / totalToProcess) * 100)
          : 100,
      createdAt: activeImport.createdAt,
      completedAt: activeImport.completedAt,
    }
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
      console.error("Failed to setup Gmail watch:", error)
      return status(500)
    }
  }
}
