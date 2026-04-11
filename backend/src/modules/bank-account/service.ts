import { NotFoundError, status, t } from "elysia"
import { prisma } from "../../lib/prisma"
import { getAllQuery } from "./query"
import { Static } from "elysia"

export const bankAccountCreateBody = t.Object({
  displayName: t.String({ minLength: 1, maxLength: 100 }),
  bankName: t.String({ minLength: 1, maxLength: 50 }),
  initialBalance: t.Number(),
})

export const bankAccountUpdateBody = t.Object({
  displayName: t.String({ minLength: 1, maxLength: 100 }),
})

type GetAllQuery = Static<typeof getAllQuery>
type BankAccountCreateInput = Static<typeof bankAccountCreateBody>
type BankAccountUpdateInput = Static<typeof bankAccountUpdateBody>

export abstract class BankAccountService {
  static async getAll(userId: string, query: GetAllQuery) {
    const { page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.bankAccount.findMany({
        where: { userId },
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
    const account = await prisma.bankAccount.findUnique({ where: { id, userId } })
    if (!account) throw new NotFoundError("Bank account doesn't exist")
    return account
  }

  static async create(userId: string, input: BankAccountCreateInput) {
    const { displayName, bankName, initialBalance } = input
    const result = await prisma.bankAccount.create({
      data: { userId, displayName, bankName, balance: initialBalance },
    })
    return status(201, result)
  }

  static async update(userId: string, id: string, input: BankAccountUpdateInput) {
    const isExist = await prisma.bankAccount.findUnique({ where: { id, userId } })
    if (!isExist) throw new NotFoundError("Bank account doesn't exist")

    const result = await prisma.bankAccount.update({
      where: { id, userId },
      data: input,
    })
    return result
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
        await tx.transaction.updateMany({ where: { bankAccountId: id }, data: { bankAccountId: null } })
        await tx.bankAccount.delete({ where: { id, userId } })
      })
    }

    return { message: "Bank account deleted successfully" }
  }
}
