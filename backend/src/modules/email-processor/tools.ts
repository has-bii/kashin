import { z } from "zod"
import { tool } from "@langchain/core/tools"
import { prisma } from "../../lib/prisma"

export const createGetCategoriesTool = (userId: string) =>
  tool(
    async () => {
      const categories = await prisma.category.findMany({
        where: { userId },
        select: { id: true, name: true, type: true, icon: true },
      })
      return JSON.stringify(categories)
    },
    {
      name: "getCategories",
      description:
        "Get all transaction categories for the user. Use this to suggest the best matching category for the transaction.",
      schema: z.object({}),
    },
  )

export const createGetBankAccountsTool = (userId: string) =>
  tool(
    async () => {
      const bankAccounts = await prisma.bankAccount.findMany({
        where: { userId },
        select: {
          id: true,
          balance: true,
          bank: { select: { id: true, name: true, email: true } },
        },
      })
      return JSON.stringify(bankAccounts)
    },
    {
      name: "getBankAccounts",
      description:
        "Get all bank accounts for the user. Use this to identify which bank account the transaction belongs to.",
      schema: z.object({}),
    },
  )

export const createGetRecentTransactionsTool = (userId: string) =>
  tool(
    async () => {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { transactionDate: "desc" },
        take: 10,
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          transactionDate: true,
          category: { select: { name: true } },
        },
      })
      return JSON.stringify(transactions)
    },
    {
      name: "getRecentTransactions",
      description:
        "Get the 10 most recent transactions for context. Use this to avoid duplicates and understand spending patterns.",
      schema: z.object({}),
    },
  )
