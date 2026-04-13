import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Min. 8 karakter").max(32, "Maks. 32 karakter"),
})

export type LoginDto = z.infer<typeof loginSchema>
