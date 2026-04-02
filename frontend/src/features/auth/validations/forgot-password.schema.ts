import { z } from "zod/v4"

export const forgotPasswordSchema = z.object({
  email: z.email(),
})

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>
