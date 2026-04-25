import type { AiUsageKind } from "../../generated/prisma/client"
import { QuotaExceededError } from "../../global/error"
import { prisma } from "../../lib/prisma"

export abstract class AiUsageService {
  static async assertQuotaAndRecord(
    userId: string,
    kind: AiUsageKind,
    refId?: string,
  ): Promise<void> {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    await prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.findUnique({
        where: { userId },
        select: { plan: { select: { dailyAiLimit: true } } },
      })

      const limit = subscription?.plan?.dailyAiLimit ?? 5

      const daily = await tx.aiUsageDaily.upsert({
        where: { userId_date: { userId, date: today } },
        create: { userId, date: today, count: 1 },
        update: { count: { increment: 1 } },
        select: { count: true },
      })

      if (daily.count > limit) {
        throw new QuotaExceededError("Daily AI quota exceeded")
      }

      await tx.aiUsageEvent.create({
        data: { userId, usageDate: today, kind, refId },
      })
    })
  }

  static async getDailyUsage(userId: string): Promise<{ count: number; limit: number }> {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const [daily, subscription] = await Promise.all([
      prisma.aiUsageDaily.findUnique({
        where: { userId_date: { userId, date: today } },
        select: { count: true },
      }),
      prisma.subscription.findUnique({
        where: { userId },
        select: { plan: { select: { dailyAiLimit: true } } },
      }),
    ])

    return {
      count: daily?.count ?? 0,
      limit: subscription?.plan?.dailyAiLimit ?? 5,
    }
  }
}
