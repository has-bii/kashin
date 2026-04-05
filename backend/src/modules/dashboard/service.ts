import { prisma } from "../../lib/prisma"
import { categoryBreakdownQuery, recentQuery, summaryQuery, trendsQuery } from "./query"

type SummaryQuery = (typeof summaryQuery)["static"]
type CategoryBreakdownQuery = (typeof categoryBreakdownQuery)["static"]
type TrendsQuery = (typeof trendsQuery)["static"]
type RecentQuery = (typeof recentQuery)["static"]

// Suppress unused type warnings — used in method signatures below
void ({} as TrendsQuery)
void ({} as RecentQuery)

function resolveMonthRange(dateFrom?: string, dateTo?: string) {
  if (dateFrom && dateTo) {
    return { gte: new Date(dateFrom), lte: new Date(dateTo) }
  }
  const now = new Date()
  return {
    gte: new Date(now.getFullYear(), now.getMonth(), 1),
    lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  }
}

const categoryInclude = {
  category: { select: { id: true, name: true, type: true, icon: true, color: true } },
}

export abstract class DashboardService {
  static async summary(userId: string, query: SummaryQuery) {
    const transactionDate = resolveMonthRange(query.dateFrom, query.dateTo)

    const [incomeResult, expenseResult] = await prisma.$transaction([
      prisma.transaction.aggregate({
        where: { userId, type: "income", transactionDate },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "expense", transactionDate },
        _sum: { amount: true },
      }),
    ])

    const totalIncome = parseFloat((incomeResult._sum.amount ?? 0).toString())
    const totalExpense = parseFloat((expenseResult._sum.amount ?? 0).toString())

    return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense }
  }

  static async categoryBreakdown(userId: string, query: CategoryBreakdownQuery) {
    void prisma
    void resolveMonthRange(query.dateFrom, query.dateTo)
    return []
  }

  static async trends(userId: string, months: number = 6) {
    void prisma
    void months
    return []
  }

  static async recent(userId: string, limit: number = 5) {
    return prisma.transaction.findMany({
      where: { userId },
      include: categoryInclude,
      orderBy: { transactionDate: "desc" },
      take: limit,
    })
  }
}
