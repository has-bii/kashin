import { NotFoundError, status, t } from "elysia"
import { BudgetPeriod } from "../../generated/prisma/enums"
import { Conflict } from "../../global/error"
import { prisma } from "../../lib/prisma"

export const budgetCreateBody = t.Object({
  categoryId: t.String(),
  amount: t.Number({ minimum: 0.01 }),
  period: t.Union([t.Literal("daily"), t.Literal("weekly"), t.Literal("monthly")]),
  alertThreshold: t.Optional(t.Number({ minimum: 0.01, maximum: 1 })),
})

export const budgetUpdateBody = t.Partial(budgetCreateBody)

type CreateInput = (typeof budgetCreateBody)["static"]
type UpdateInput = (typeof budgetUpdateBody)["static"]

function getUtcFromLocal(dateStr: string, time: string, timezone: string): Date {
  const fakeUtc = new Date(`${dateStr}T${time}Z`)
  const localAsUtc = new Date(fakeUtc.toLocaleString("en-US", { timeZone: "UTC" }))
  const targetAsUtc = new Date(fakeUtc.toLocaleString("en-US", { timeZone: timezone }))
  const offset = localAsUtc.getTime() - targetAsUtc.getTime()
  return new Date(fakeUtc.getTime() + offset)
}

function getPeriodRange(period: BudgetPeriod, timezone: string): { gte: Date; lte: Date } {
  const localDateStr = new Date().toLocaleDateString("en-CA", { timeZone: timezone })
  const [year, month, day] = localDateStr.split("-").map(Number)

  let startStr: string
  let endStr: string

  if (period === "daily") {
    startStr = endStr = localDateStr
  } else if (period === "weekly") {
    const d = new Date(`${localDateStr}T12:00:00`)
    const dow = d.getDay() === 0 ? 7 : d.getDay() // ISO: 1=Mon … 7=Sun
    const monday = new Date(d)
    monday.setDate(day - dow + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    startStr = monday.toLocaleDateString("en-CA", { timeZone: timezone })
    endStr = sunday.toLocaleDateString("en-CA", { timeZone: timezone })
  } else {
    const lastDay = new Date(year, month, 0).getDate()
    startStr = `${year}-${String(month).padStart(2, "0")}-01`
    endStr = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
  }

  return {
    gte: getUtcFromLocal(startStr, "00:00:00", timezone),
    lte: getUtcFromLocal(endStr, "23:59:59.999", timezone),
  }
}

const categorySelect = { select: { id: true, name: true, icon: true, color: true } }

export abstract class BudgetService {
  static async getAll(userId: string, timezone: string) {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: categorySelect },
      orderBy: { createdAt: "desc" },
    })

    return Promise.all(
      budgets.map(async (budget) => {
        const { gte, lte } = getPeriodRange(budget.period, timezone)

        const agg = await prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: "expense",
            transactionDate: { gte, lte },
          },
          _sum: { amount: true },
        })

        const spent = Number(agg._sum.amount ?? 0)
        const amount = Number(budget.amount)
        const remaining = amount - spent
        const ratio = amount > 0 ? spent / amount : 0
        const alertStatus =
          ratio >= 1 ? "exceeded" : ratio >= budget.alertThreshold ? "warning" : "ok"

        return {
          ...budget,
          amount,
          periodRange: { from: gte.toISOString().slice(0, 10), to: lte.toISOString().slice(0, 10) },
          spent,
          remaining,
          alertStatus,
        }
      }),
    )
  }

  static async create(userId: string, input: CreateInput) {
    const count = await prisma.budget.count({ where: { userId } })
    if (count >= 10) throw new Conflict("Budget limit of 10 reached")

    const duplicate = await prisma.budget.findUnique({
      where: {
        userId_categoryId_period: {
          userId,
          categoryId: input.categoryId,
          period: input.period as BudgetPeriod,
        },
      },
    })
    if (duplicate) throw new Conflict("Budget for this category and period already exists")

    const result = await prisma.budget.create({
      data: { ...input, period: input.period as BudgetPeriod, userId },
      include: { category: categorySelect },
    })

    return status(201, result)
  }

  static async update(userId: string, id: string, input: UpdateInput) {
    const existing = await prisma.budget.findUnique({ where: { id, userId } })
    if (!existing) throw new NotFoundError("Budget not found")

    const newCategoryId = input.categoryId ?? existing.categoryId
    const newPeriod = (input.period ?? existing.period) as BudgetPeriod

    if (input.categoryId || input.period) {
      const duplicate = await prisma.budget.findUnique({
        where: {
          userId_categoryId_period: { userId, categoryId: newCategoryId, period: newPeriod },
        },
      })
      if (duplicate && duplicate.id !== id)
        throw new Conflict("Budget for this category and period already exists")
    }

    return prisma.budget.update({
      where: { id, userId },
      data: { ...input, ...(input.period ? { period: input.period as BudgetPeriod } : {}) },
      include: { category: categorySelect },
    })
  }

  static async delete(userId: string, id: string) {
    const existing = await prisma.budget.findUnique({ where: { id, userId } })
    if (!existing) throw new NotFoundError("Budget not found")

    return prisma.budget.delete({ where: { id, userId } })
  }
}
