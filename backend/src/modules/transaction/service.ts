import { NotFoundError, status, t } from "elysia"

import { __nullable__ } from "../../generated/prismabox/__nullable__"
import {
  TransactionPlainInputCreate,
  TransactionPlainInputUpdate,
} from "../../generated/prismabox/Transaction"
import { prisma } from "../../lib/prisma"
import { getAllQuery } from "./query"

export const transactionCreateBody = t.Composite([
  TransactionPlainInputCreate,
  t.Object({ categoryId: t.Optional(__nullable__(t.String())) }),
])

export const transactionUpdateBody = t.Composite([
  TransactionPlainInputUpdate,
  t.Object({ categoryId: t.Optional(__nullable__(t.String())) }),
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
    const { categoryId, ...rest } = input

    const result = await prisma.transaction.create({
      data: {
        ...rest,
        userId,
        ...(categoryId !== undefined ? { categoryId } : {}),
      },
      include: categoryInclude,
    })

    return status(201, result)
  }

  static async update(userId: string, id: string, input: TransactionUpdateInput) {
    const isExist = await prisma.transaction.findUnique({ where: { id, userId } })
    if (!isExist) throw new NotFoundError("Transaction doesn't exist")

    const { categoryId, ...rest } = input

    return prisma.transaction.update({
      where: { id, userId },
      data: {
        ...rest,
        ...(categoryId !== undefined ? { categoryId } : {}),
      },
      include: categoryInclude,
    })
  }

  static async delete(userId: string, id: string) {
    const isExist = await prisma.transaction.findUnique({ where: { id, userId } })
    if (!isExist) throw new NotFoundError("Transaction doesn't exist")

    return prisma.transaction.delete({ where: { id, userId } })
  }

  static async bulkDelete(userId: string, ids: string[]) {
    return prisma.transaction.deleteMany({ where: { id: { in: ids }, userId } })
  }
}
