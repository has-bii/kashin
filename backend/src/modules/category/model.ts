import { z } from "zod/v4"

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["expense", "income"]),
  icon: z.string().max(50).optional(),
  color: z.string().max(7).optional(),
  sortOrder: z.int().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categoryQuerySchema = z.object({
  type: z.enum(["expense", "income"]).optional(),
})

export type CreateCategoryDto = z.infer<typeof createCategorySchema>
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>
export type CategoryQuery = z.infer<typeof categoryQuerySchema>
