import { z } from "zod/v4"

export const categorySchema = z.object({
  name: z.string().min(4, "Min. 4 karakter").max(32, "Maks. 32 karakter"),
  icon: z.emoji(),
  color: z.string().regex(/^#([A-Fa-f0-9]{3}){1,2}$/, {
    error: "Format warna tidak valid",
  }),
  type: z.enum(["expense", "income"]),
})

export type CategoryDto = z.infer<typeof categorySchema>
