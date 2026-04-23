import { z } from "zod/v4"

export const confirmAiExtractionSchema = z.object({
  type: z.enum(["expense", "income"]).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  categoryId: z.string().nullable().optional(),
  bankAccountId: z.string().nullable().optional(),
  description: z.string().max(255).nullable().optional(),
  transactionDate: z.iso.datetime().optional(),
  notes: z.string().nullable().optional(),
})

export type ConfirmAiExtractionDto = z.infer<typeof confirmAiExtractionSchema>
