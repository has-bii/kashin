import { z } from "zod/v4"

export const BANK_NAMES = ["bca", "jago", "cash"] as const

export const bankAccountSchema = z.object({
  bankId: z.string().min(0, "Bank is required"),
  initialBalance: z.number().min(0, "Must be a positive number"),
})

export type BankAccountDto = z.infer<typeof bankAccountSchema>
