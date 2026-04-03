import { z } from "zod/v4"

export const categoryCreateSchema = z.object({
  name: z.string().min(4, "Min. 4 characters").max(32, "Max. 32 characters"),
  icon: z.emoji(),
  color: z.string().regex(/^#([A-Fa-f0-9]{3}){1,2}$/, {
    error: "Invalid hex color format",
  }),
  type: z.enum(["expense", "income"]),
})

export const categoryUpdateSchema = categoryCreateSchema.partial()

export type CategoryCreateDto = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateDto = z.infer<typeof categoryUpdateSchema>
