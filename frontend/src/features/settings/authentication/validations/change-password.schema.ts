import { z } from "zod/v4"

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Min. 8 karakter").max(32, "Maks. 32 karakter"),
    newPassword: z.string().min(8, "Min. 8 karakter").max(32, "Maks. 32 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  })

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>
