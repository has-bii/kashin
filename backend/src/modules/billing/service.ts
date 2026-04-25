import { prisma } from "../../lib/prisma"
import { NotFoundError } from "../../global/error"

export abstract class BillingService {
  static async getUserStatus(userId: string) {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const [subscription, daily] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId },
        select: {
          status: true,
          currentPeriodEnd: true,
          plan: {
            select: { code: true, name: true, dailyAiLimit: true, priceCents: true, currency: true },
          },
        },
      }),
      prisma.aiUsageDaily.findUnique({
        where: { userId_date: { userId, date: today } },
        select: { count: true },
      }),
    ])

    if (!subscription) throw new NotFoundError("Subscription not found")

    return {
      plan: subscription.plan,
      subscription: {
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      usage: {
        today: daily?.count ?? 0,
        limit: subscription.plan.dailyAiLimit,
      },
    }
  }
}
