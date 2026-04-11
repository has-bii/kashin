import { z } from 'zod/v4'

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  amount: z.number({ error: 'Required' }).min(0.01, 'Must be greater than 0'),
  period: z.enum(['daily', 'weekly', 'monthly']),
  alertThreshold: z
    .number({ error: 'Required' })
    .min(1, 'Min 1%')
    .max(100, 'Max 100%'),
})

export type BudgetDto = z.infer<typeof budgetSchema>
