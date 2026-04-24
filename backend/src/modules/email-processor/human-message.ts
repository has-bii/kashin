import { Bank, BankAccount, Category } from "../../generated/prisma/client"
import { HumanMessage } from "@langchain/core/messages"

export interface EmailInput {
  from: string
  subject: string
  snippet: string
  body: string
}

type Categories = Pick<Category, "id" | "name" | "type">[]
type BankAccounts = Pick<BankAccount, "id" | "balance" | "bankId"> & {
  bank: Pick<Bank, "id" | "name" | "email">
}

export function generateHumanMessage(
  email: EmailInput,
  categories: Categories,
  bankAccounts: BankAccounts[],
) {
  return new HumanMessage(
    `Analyze this email. If it is a transaction email, extract the transaction details.

## Available Categories
${JSON.stringify(categories, null, 2)}

## Available Bank Accounts
${JSON.stringify(bankAccounts, null, 2)}

## Email
Email From: ${email.from}
Subject: ${email.subject}
Snippet: ${email.snippet}
Body:
${email.body}`,
  )
}
