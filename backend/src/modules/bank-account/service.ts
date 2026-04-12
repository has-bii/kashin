import { NotFoundError, status, t } from "elysia"
import { prisma } from "../../lib/prisma"
import { Conflict } from "../../global/error"
import { getAllQuery } from "./query"

export const bankAccountCreateBody = t.Object({
  bankId: t.String({ format: "uuid" }),
  initialBalance: t.Number(),
})

type GetAllQuery = (typeof getAllQuery)["static"]
type BankAccountCreateInput = (typeof bankAccountCreateBody)["static"]

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

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getById(userId: string, id: string) {
    const account = await prisma.bankAccount.findUnique({ where: { id, userId }, include: { bank: true } })
    if (!account) throw new NotFoundError("Bank account doesn't exist")
    return account
  }

  static async create(userId: string, input: BankAccountCreateInput) {
    const { bankId, initialBalance } = input
    const bank = await prisma.bank.findUnique({ where: { id: bankId } })
    if (!bank) throw new NotFoundError("Bank doesn't exist")
    const existing = await prisma.bankAccount.findUnique({ where: { userId_bankId: { userId, bankId } } })
    if (existing) throw new Conflict(`You already have a ${bank.name} account`)
    const result = await prisma.bankAccount.create({
      data: { userId, bankId, balance: initialBalance },
      include: { bank: true },
    })
    return status(201, result)
  }

  static async delete(userId: string, id: string, deleteTransactions: boolean) {
    const isExist = await prisma.bankAccount.findUnique({ where: { id, userId } })
    if (!isExist) throw new NotFoundError("Bank account doesn't exist")

    if (deleteTransactions) {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.deleteMany({ where: { bankAccountId: id, userId } })
        await tx.bankAccount.delete({ where: { id, userId } })
      })
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.updateMany({ where: { bankAccountId: id, userId }, data: { bankAccountId: null } })
        await tx.bankAccount.delete({ where: { id, userId } })
      })
    }

    return { message: "Bank account deleted successfully" }
  }
}
