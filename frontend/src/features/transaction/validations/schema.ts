import { z } from "zod/v4"

export const transactionCreateSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.coerce.number().positive(),
  transactionDate: z.string().date(),
  categoryId: z.string().nullable().optional(),
  description: z.string().max(255).optional(),
  notes: z.string().optional(),
})

export const transactionUpdateSchema = transactionCreateSchema.partial()

export type TransactionCreateDto = z.infer<typeof transactionCreateSchema>
export type TransactionUpdateDto = z.infer<typeof transactionUpdateSchema>
