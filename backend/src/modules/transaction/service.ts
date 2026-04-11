import { Prisma } from "../../generated/prisma/client"
import {
  TransactionPlainInputCreate,
  TransactionPlainInputUpdate,
} from "../../generated/prismabox/Transaction"
import { __nullable__ } from "../../generated/prismabox/__nullable__"
import { prisma } from "../../lib/prisma"
import { getAllQuery } from "./query"
import { NotFoundError, status, t } from "elysia"

export const transactionCreateBody = t.Composite([
  TransactionPlainInputCreate,
  t.Object({
    categoryId: t.Optional(__nullable__(t.String())),
    bankAccountId: t.Optional(__nullable__(t.String())),
  }),
])

export const transactionUpdateBody = t.Composite([
  TransactionPlainInputUpdate,
  t.Object({
    categoryId: t.Optional(__nullable__(t.String())),
    bankAccountId: t.Optional(__nullable__(t.String())),
  }),
])

type TransactionCreateInput = (typeof transactionCreateBody)["static"]
type TransactionUpdateInput = (typeof transactionUpdateBody)["static"]
type GetAllQuery = (typeof getAllQuery)["static"]

const categoryInclude = {
  category: { select: { id: true, name: true, type: true, icon: true, color: true } },
}

export abstract class TransactionService {
  static async getAll(userId: string, query: GetAllQuery) {
    const { page = 1, limit = 20, type, categoryId, dateFrom, dateTo, search } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { userId }
    if (type) where.type = type
    if (categoryId) where.categoryId = categoryId
    if (dateFrom || dateTo) {
      where.transactionDate = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      }
    }
    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" as const } },
        { notes: { contains: search, mode: "insensitive" as const } },
      ]
    }

    const [data, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        include: categoryInclude,
        orderBy: { transactionDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async getById(userId: string, id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id, userId },
      include: categoryInclude,
    })

    if (!transaction) throw new NotFoundError("Transaction doesn't exist")

    return transaction
  }

  static async create(userId: string, input: TransactionCreateInput) {
    const { categoryId, bankAccountId, ...rest } = input

    return prisma.$transaction(async (tx) => {
      const result = await tx.transaction.create({
        data: {
          ...rest,
          userId,
          ...(categoryId !== undefined ? { categoryId } : {}),
          ...(bankAccountId !== undefined ? { bankAccountId } : {}),
        },
        include: categoryInclude,
      })

      if (bankAccountId) {
        const delta = result.type === "income" ? result.amount : result.amount.negated()
        await tx.bankAccount.update({
          where: { id: bankAccountId, userId },
          data: { balance: { increment: delta } },
        })
      }

      return status(201, result)
    })
  }

  static async update(userId: string, id: string, input: TransactionUpdateInput) {
    const old = await prisma.transaction.findUnique({ where: { id, userId } })
    if (!old) throw new NotFoundError("Transaction doesn't exist")

    const { categoryId, bankAccountId, ...rest } = input

    return prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id, userId },
        data: {
          ...rest,
          ...(categoryId !== undefined ? { categoryId } : {}),
          ...(bankAccountId !== undefined ? { bankAccountId } : {}),
        },
        include: categoryInclude,
      })

      // Reverse old balance effect
      if (old.bankAccountId) {
        const oldDelta = old.type === "income" ? old.amount : old.amount.negated()
        await tx.bankAccount.update({
          where: { id: old.bankAccountId, userId },
          data: { balance: { decrement: oldDelta } },
        })
      }

      // Apply new balance effect
      const newBankAccountId = bankAccountId !== undefined ? bankAccountId : old.bankAccountId
      if (newBankAccountId) {
        const newDelta = updated.type === "income" ? updated.amount : updated.amount.negated()
        await tx.bankAccount.update({
          where: { id: newBankAccountId, userId },
          data: { balance: { increment: newDelta } },
        })
      }

      return updated
    })
  }

  static async delete(userId: string, id: string) {
    const old = await prisma.transaction.findUnique({ where: { id, userId } })
    if (!old) throw new NotFoundError("Transaction doesn't exist")

    return prisma.$transaction(async (tx) => {
      await tx.transaction.delete({ where: { id, userId } })

      if (old.bankAccountId) {
        const delta = old.type === "income" ? old.amount : old.amount.negated()
        await tx.bankAccount.update({
          where: { id: old.bankAccountId, userId },
          data: { balance: { decrement: delta } },
        })
      }
    })
  }

  static async bulkDelete(userId: string, ids: string[]) {
    const transactions = await prisma.transaction.findMany({
      where: { id: { in: ids }, userId },
      select: { id: true, type: true, amount: true, bankAccountId: true },
    })

    return prisma.$transaction(async (tx) => {
      await tx.transaction.deleteMany({ where: { id: { in: ids }, userId } })

      const balanceChanges = new Map<string, Prisma.Decimal>()
      for (const txn of transactions) {
        if (txn.bankAccountId) {
          const delta = txn.type === "income" ? txn.amount : txn.amount.negated()
          const current = balanceChanges.get(txn.bankAccountId) ?? new Prisma.Decimal(0)
          balanceChanges.set(txn.bankAccountId, current.add(delta))
        }
      }

      for (const [accountId, totalDelta] of balanceChanges) {
        await tx.bankAccount.update({
          where: { id: accountId, userId },
          data: { balance: { decrement: totalDelta } },
        })
      }
    })
  }

  static async exportAll(userId: string, query: GetAllQuery): Promise<string> {
    const { type, categoryId, dateFrom, dateTo, search } = query

    const where: Record<string, unknown> = { userId }
    if (type) where.type = type
    if (categoryId) where.categoryId = categoryId
    if (dateFrom || dateTo) {
      where.transactionDate = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      }
    }
    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" as const } },
        { notes: { contains: search, mode: "insensitive" as const } },
      ]
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: categoryInclude,
      orderBy: { transactionDate: "desc" },
    })

    const escapeCell = (value: string | null | undefined): string => {
      if (value == null) return ""
      const str = String(value)
      // Wrap in quotes if contains comma, quote, or newline
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const headers = "Date,Type,Amount,Currency,Category,Description,Notes"
    const rows = transactions.map((tx) => {
      const date = tx.transactionDate.toISOString().slice(0, 10)
      return [
        date,
        tx.type,
        tx.amount.toString(),
        tx.currency,
        escapeCell(tx.category?.name ?? null),
        escapeCell(tx.description),
        escapeCell(tx.notes),
      ].join(",")
    })

    return [headers, ...rows].join("\n")
  }
}
