import { z } from "zod/v4"

export const recurringTransactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.number().positive(),
  description: z.string().max(255),
  categoryId: z.string().nullable(),
  frequency: z.enum(["weekly", "biweekly", "monthly", "yearly"]),
  nextDueDate: z.iso.datetime(),
})

export type RecurringTransactionDto = z.infer<typeof recurringTransactionSchema>
