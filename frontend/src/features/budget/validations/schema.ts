import { z } from "zod/v4"

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Pilih kategori terlebih dahulu"),
  amount: z.number({ error: "Wajib diisi" }).min(0.01, "Harus lebih dari 0"),
  period: z.enum(["daily", "weekly", "monthly"]),
  alertThreshold: z.number({ error: "Wajib diisi" }).min(1, "Min. 1%").max(100, "Maks. 100%"),
})

export type BudgetDto = z.infer<typeof budgetSchema>
