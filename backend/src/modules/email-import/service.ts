import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma"
import { EmailProcessorService } from "../email-processor/service"
import { GmailService } from "../gmail/service"
import { inngest } from "../inngest/client"
import { INNGEST_FUNCTION_EVENTS } from "../inngest/functions"
import { status } from "elysia"

export abstract class EmailImportService {
  /* ---------------------------- API Endpoints ---------------------------- */
  static async importEmails(userId: string, after: string, before: string) {
    // Check if email import is processed
    const activeImport = await prisma.emailImport.findFirst({
      where: { userId, status: { in: ["gathering", "processing", "processing", "analyzing"] } },
    })
    if (activeImport) {
      throw status(409, "An import is already in progress")
    }

    // Create email import
    const emailImport = await prisma.emailImport.create({
      data: {
        userId,
        status: "gathering",
        afterDate: new Date(after),
        beforeDate: new Date(before),
      },
    })

    // Get access token
    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: "google",
        userId,
      },
    })

    // Create gmail client
    const gmailClient = GmailService.createGmailClient(accessToken)

    // Get messageIds
    const allMessageIds = await GmailService.listMessageIds(
      gmailClient,
      new Date(after),
      new Date(before),
    )

    // Get EmailLog
    const existingLogs = await prisma.emailLog.findMany({
      where: { userId, gmailMessageId: { in: allMessageIds } },
      select: { gmailMessageId: true },
    })

    // Filtering
    const existingIds = new Set(existingLogs.map((l) => l.gmailMessageId))
    const newMessageIds = allMessageIds.filter((id) => !existingIds.has(id))

    // Update Email Import
    await prisma.emailImport.update({
      where: { id: emailImport.id },
      data: {
        totalEmails: allMessageIds.length,
        skippedEmails: allMessageIds.length - newMessageIds.length,
        status: newMessageIds.length > 0 ? "processing" : "completed",
        completedAt: newMessageIds.length === 0 ? new Date() : undefined,
      },
    })

    await Promise.all(
      newMessageIds.map((messageId) =>
        INNGEST_FUNCTION_EVENTS.fetchEmail.sendEvent({
          userId,
          messageId,
          emailImportId: emailImport.id,
        }),
      ),
    )

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

  /* --------------------------------- Private -------------------------------- */
  static async updateEmailImportProcessing(
    emailImportId: string,
    status: "failed" | "skipped" | "received",
  ) {
    const data = await prisma.emailImport.update({
      where: { id: emailImportId },
      data: {
        receivedEmails:
          status === "received"
            ? {
                increment: 1,
              }
            : undefined,
        skippedEmails:
          status === "skipped"
            ? {
                increment: 1,
              }
            : undefined,
        failedEmails:
          status === "skipped"
            ? {
                increment: 1,
              }
            : undefined,
      },
      select: {
        totalEmails: true,
        failedEmails: true,
        skippedEmails: true,
        receivedEmails: true,
        userId: true,
      },
    })

    const { totalEmails, receivedEmails, failedEmails, skippedEmails } = data

    if (totalEmails > receivedEmails + failedEmails + skippedEmails) {
      return null
    }

    if (receivedEmails === 0) {
      await prisma.emailImport.update({
        where: { id: emailImportId },
        select: null,
        data: { status: "completed" },
      })
      return null
    } else {
      await prisma.emailImport.update({
        where: { id: emailImportId },
        data: { status: "analyzing" },
      })

      const emailLogIds = await prisma.emailLog.findMany({
        where: { userId: data.userId, status: "received" },
        select: { id: true },
      })

      await Promise.all([
        emailLogIds.map((acc) =>
          INNGEST_FUNCTION_EVENTS.processEmail.sendEvent({
            emailImportId,
            emailLogId: acc.id.toString(),
          }),
        ),
      ])
    }
  }

  static async updateEmailImportAnalyzing(emailImportId: string, status: "failed" | "processed") {
    const data = await prisma.emailImport.update({
      where: { id: emailImportId },
      data: {
        failedAnalyzedEmails:
          status === "failed"
            ? {
                increment: 1,
              }
            : undefined,
        processedEmails:
          status === "processed"
            ? {
                increment: 1,
              }
            : undefined,
      },
      select: {
        receivedEmails: true,
        failedAnalyzedEmails: true,
        processedEmails: true,
      },
    })

    const { receivedEmails, processedEmails, failedAnalyzedEmails } = data

    if (receivedEmails > processedEmails + failedAnalyzedEmails) {
      return null
    }

    await prisma.emailImport.update({
      where: { id: emailImportId },
      select: null,
      data: { status: "completed" },
    })
  }
}
