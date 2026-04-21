import { z } from "zod/v4"

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.number().positive(),
  transactionDate: z.iso.datetime(),
  categoryId: z.string().nullable(),
  bankAccountId: z.string().nullable(),
  description: z.string().max(255),
  notes: z.string(),
})

export type TransactionDto = z.infer<typeof transactionSchema>
