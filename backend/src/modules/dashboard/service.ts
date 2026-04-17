import { prisma } from "../../lib/prisma"
import type { SummaryQuery, CategoryBreakdownQuery } from "./dto"

const categoryInclude = {
  category: { select: { id: true, name: true, type: true, icon: true, color: true } },
}

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

function buildMonthBuckets(months: number): string[] {
  const result: string[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`)
  }
  return result
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
    const transactionDate = resolveMonthRange(query.dateFrom, query.dateTo)

    const groups = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, type: "expense", transactionDate, categoryId: { not: null } },
      _sum: { amount: true },
    })

    const categoryIds = groups.map((g) => g.categoryId).filter(Boolean) as string[]
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true, color: true },
    })

    const categoryMap = new Map(categories.map((c) => [c.id, c]))
    return groups.map((g) => ({
      categoryId: g.categoryId,
      category: categoryMap.get(g.categoryId!),
      total: parseFloat((g._sum.amount ?? 0).toString()),
    }))
  }

  static async trends(userId: string, months: number = 6) {
    const now = new Date()
    const windowStart = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
    const windowEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const transactions = await prisma.transaction.findMany({
      where: { userId, transactionDate: { gte: windowStart, lte: windowEnd } },
      select: { type: true, amount: true, transactionDate: true },
    })

    const bucketMap = new Map<string, { income: number; expense: number }>()
    for (const tx of transactions) {
      const key = `${tx.transactionDate.getFullYear()}-${String(tx.transactionDate.getMonth() + 1).padStart(2, "0")}`
      const entry = bucketMap.get(key) ?? { income: 0, expense: 0 }
      const amount = parseFloat(tx.amount.toString())
      if (tx.type === "income") entry.income += amount
      else entry.expense += amount
      bucketMap.set(key, entry)
    }

    const monthKeys = buildMonthBuckets(months)
    return monthKeys.map((month) => ({
      month,
      income: bucketMap.get(month)?.income ?? 0,
      expense: bucketMap.get(month)?.expense ?? 0,
    }))
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
