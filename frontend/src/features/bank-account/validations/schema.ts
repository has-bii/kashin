import { z } from "zod/v4"

export const bankAccountCreateSchema = z.object({
  displayName: z.string().min(1, "Account name is required").max(100, "Max. 100 characters"),
  bankName: z.string().min(1),
  initialBalance: z.number().min(0, "Must positive number"),
})

export const bankAccountUpdateSchema = z.object({
  displayName: z.string().min(1).max(100),
})

export type BankAccountCreateDto = z.infer<typeof bankAccountCreateSchema>
export type BankAccountUpdateDto = z.infer<typeof bankAccountUpdateSchema>
