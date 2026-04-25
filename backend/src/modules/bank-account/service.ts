import { createError } from "../../global/error"
import { prisma } from "../../lib/prisma"
import type { CreateInput, GetAllQuery } from "./dto"
import { status } from "elysia"

export abstract class BankAccountService {
  static async getAll(userId: string, query: GetAllQuery) {
    const { page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.bankAccount.findMany({
        where: { userId },
        include: { bank: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bankAccount.count({ where: { userId } }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  static async getById(userId: string, id: string) {
    const account = await prisma.bankAccount.findUnique({
      where: { id, userId },
      include: { bank: true },
    })
    if (!account) createError("not_found", "Bank account not found")
    return account!
  }

  static async create(userId: string, input: CreateInput) {
    const { bankId, initialBalance } = input
    const bank = await prisma.bank.findUnique({ where: { id: bankId } })
    if (!bank) createError("not_found", "Bank not found")

    const existing = await prisma.bankAccount.findUnique({
      where: { userId_bankId: { userId, bankId } },
    })
    if (existing) createError("conflict", `You already have an account with ${bank!.name}`)

    const result = await prisma.bankAccount.create({
      data: { userId, bankId, balance: initialBalance },
      include: { bank: true },
    })
    return status(201, result)
  }

  static async delete(userId: string, id: string, deleteTransactions: boolean) {
    const isExist = await prisma.bankAccount.findUnique({ where: { id, userId } })
    if (!isExist) createError("not_found", "Bank account not found")

    if (deleteTransactions) {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.deleteMany({ where: { bankAccountId: id, userId } })
        await tx.bankAccount.delete({ where: { id, userId } })
      })
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.updateMany({
          where: { bankAccountId: id, userId },
          data: { bankAccountId: null },
        })
        await tx.bankAccount.delete({ where: { id, userId } })
      })
    }

    return { message: "Bank account deleted successfully" }
  }
}
