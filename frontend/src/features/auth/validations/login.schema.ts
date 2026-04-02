import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Min. 8 characters").max(32, "Max. 32 characters"),
})

export type LoginDto = z.infer<typeof loginSchema>
