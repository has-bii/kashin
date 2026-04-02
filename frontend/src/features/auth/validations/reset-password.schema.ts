import { z } from "zod/v4"

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d{6}$/, "OTP must be numeric"),
    password: z.string().min(8, "Min. 8 characters").max(32, "Max. 32 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
