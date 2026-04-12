import { z } from "zod/v4"

export const recurringTransactionCreateSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.number().positive(),
  description: z.string().max(255),
  categoryId: z.string().nullable(),
  frequency: z.enum(["weekly", "biweekly", "monthly", "yearly"]),
  nextDueDate: z.iso.datetime(),
})

export const recurringTransactionUpdateSchema = recurringTransactionCreateSchema.partial()

export type RecurringTransactionCreateDto = z.infer<typeof recurringTransactionCreateSchema>
export type RecurringTransactionUpdateDto = z.infer<typeof recurringTransactionUpdateSchema>
