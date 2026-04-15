import { prisma } from "../../lib/prisma"
import { tool } from "@langchain/core/tools"
import { ToolMessage, createMiddleware } from "langchain"
import { z } from "zod"

const getCategories = tool(
  async (_, config) => {
    const userId = config.context.userId
    const categories = await prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true, type: true },
    })
    return categories
  },
  {
    name: "getCategories",
    description:
      "Get all transaction categories for the user. Use this to suggest the best matching category for the transaction.",
    schema: z.object({}),
  },
)

const getBankAccounts = tool(
  async (_, config) => {
    const userId = config.context.userId

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId },
      select: {
        id: true,
        balance: true,
        bankId: true,
        bank: { select: { id: true, name: true, email: true } },
      },
    })

    return bankAccounts.map((acc) => ({ ...acc, balance: acc.balance.toString() }))
  },
  {
    name: "getBankAccounts",
    description:
      "Get all bank accounts for the user. Use this to identify which bank account the transaction belongs to.",
    schema: z.object({}),
  },
)

const getRecentTransactions = tool(
  async (_, config) => {
    const userId = config.context.userId
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
        category: { select: { id: true, name: true } },
      },
    })
    return transactions
  },
  {
    name: "getRecentTransactions",
    description:
      "Get the 10 most recent transactions for context. Use this to avoid duplicates and understand spending patterns.",
    schema: z.object({}),
  },
)

export const handleToolErrors = createMiddleware({
  name: "HandleToolErrors",
  wrapToolCall: async (request, handler) => {
    try {
      return await handler(request)
    } catch (error) {
      return new ToolMessage({
        content: `Tool error: (${error})`,
        tool_call_id: request.toolCall.id!,
      })
    }
  },
})

export const tools = [getCategories, getBankAccounts, getRecentTransactions]
