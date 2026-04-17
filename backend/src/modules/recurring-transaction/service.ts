import { createError } from "../../global/error"
import { prisma } from "../../lib/prisma"
import { qstash } from "../../lib/qstash"
import { status } from "elysia"
import type { CreateInput, UpdateInput, GetAllQuery } from "./dto"

const categoryInclude = {
  category: { select: { id: true, name: true, type: true, icon: true, color: true } },
}

function computeNextDueDate(from: Date, frequency: string): Date {
  const d = new Date(from)
  switch (frequency) {
    case "weekly":
      d.setDate(d.getDate() + 7)
      break
    case "biweekly":
      d.setDate(d.getDate() + 14)
      break
    case "monthly":
      d.setMonth(d.getMonth() + 1)
      break
    case "yearly":
      d.setFullYear(d.getFullYear() + 1)
      break
  }
  return d
}

async function scheduleNext(id: string, runAt: Date): Promise<void> {
  const url = `${process.env.BETTER_AUTH_URL}/api/webhook/recurring-transaction`
  await qstash.publishJSON({
    url,
    body: { recurringTransactionId: id, scheduledFor: runAt.toISOString() },
    notBefore: Math.floor(runAt.getTime() / 1000),
  })
}

export abstract class RecurringTransactionService {
  static async getAll(userId: string, query: GetAllQuery) {
    const { page = 1, limit = 20, type, isActive } = query
    const where = {
      userId,
      ...(type ? { type } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    }

    const [data, total] = await prisma.$transaction([
      prisma.recurringTransaction.findMany({
        where,
        include: categoryInclude,
        orderBy: { nextDueDate: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.recurringTransaction.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async getById(userId: string, id: string) {
    const item = await prisma.recurringTransaction.findUnique({
      where: { id, userId },
      include: categoryInclude,
    })
    if (!item) createError("not_found", "Recurring transaction not found")
    return item!
  }

  static async create(userId: string, input: CreateInput) {
    const { categoryId, ...rest } = input

    const data = await prisma.$transaction(async (tx) => {
      const item = await tx.recurringTransaction.create({
        data: { ...rest, userId, ...(categoryId !== undefined ? { categoryId } : {}) },
        include: categoryInclude,
      })
      await scheduleNext(item.id, item.nextDueDate)
      return item
    })

    return status(201, data)
  }

  static async update(userId: string, id: string, input: UpdateInput) {
    const existing = await RecurringTransactionService.getById(userId, id)
    const { categoryId, ...rest } = input

    const updated = await prisma.recurringTransaction.update({
      where: { id },
      data: { ...rest, ...(categoryId !== undefined ? { categoryId } : {}) },
      include: categoryInclude,
    })

    if (input.nextDueDate && existing.isActive) {
      await scheduleNext(id, updated.nextDueDate)
    }

    return updated
  }

  static async delete(userId: string, id: string) {
    await RecurringTransactionService.getById(userId, id)
    await prisma.recurringTransaction.delete({ where: { id } })
    // Stale QStash messages will no-op: webhook checks existence before acting
  }

  static async toggle(userId: string, id: string) {
    const existing = await RecurringTransactionService.getById(userId, id)

    const updated = await prisma.recurringTransaction.update({
      where: { id },
      data: { isActive: !existing.isActive },
      include: categoryInclude,
    })

    // Only re-schedule when turning ON (was inactive, now active)
    if (!existing.isActive) {
      await scheduleNext(id, updated.nextDueDate)
    }

    return updated
  }

  static async processWebhook(recurringTransactionId: string, scheduledFor: Date): Promise<void> {
    let nextDueDate: Date | null = null

    await prisma.$transaction(async (tx) => {
      const recurring = await tx.recurringTransaction.findUnique({
        where: { id: recurringTransactionId },
      })

      if (!recurring || !recurring.isActive) return

      // Idempotency guard — this occurrence was already processed
      if (recurring.lastGeneratedDate && recurring.lastGeneratedDate >= scheduledFor) return

      const now = new Date()
      nextDueDate = computeNextDueDate(now, recurring.frequency)

      // Atomic claim — prevents concurrent retries from both proceeding
      const claim = await tx.recurringTransaction.updateMany({
        where: {
          id: recurringTransactionId,
          OR: [{ lastGeneratedDate: null }, { lastGeneratedDate: { lt: scheduledFor } }],
        },
        data: { lastGeneratedDate: now, nextDueDate },
      })
      if (claim.count === 0) return

      await tx.transaction.create({
        data: {
          userId: recurring.userId,
          categoryId: recurring.categoryId,
          recurringTxnId: recurring.id,
          type: recurring.type,
          amount: recurring.amount,
          currency: recurring.currency,
          description: recurring.description,
          transactionDate: now,
          source: "recurring",
        },
      })
    })

    // Propagate errors — QStash will retry; idempotency guard prevents duplicate DB writes
    if (nextDueDate) {
      await scheduleNext(recurringTransactionId, nextDueDate)
    }
  }
}
