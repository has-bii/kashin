import { z } from "zod/v4"

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
})

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>
