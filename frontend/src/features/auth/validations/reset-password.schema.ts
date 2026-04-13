import { z } from "zod/v4"

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, "OTP harus 6 digit")
      .regex(/^\d{6}$/, "OTP harus berupa angka"),
    password: z.string().min(8, "Min. 8 karakter").max(32, "Maks. 32 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  })

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
