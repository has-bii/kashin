import { z } from "zod/v4"

export const bankAccountCreateSchema = z.object({
  displayName: z.string().min(1).max(100),
  bankName: z.string().min(1),
  initialBalance: z.number().min(0),
})

export const bankAccountUpdateSchema = z.object({
  displayName: z.string().min(1).max(100),
})

export type BankAccountCreateDto = z.infer<typeof bankAccountCreateSchema>
export type BankAccountUpdateDto = z.infer<typeof bankAccountUpdateSchema>
