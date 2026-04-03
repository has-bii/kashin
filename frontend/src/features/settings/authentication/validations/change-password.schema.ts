import { z } from "zod/v4"

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Min. 8 characters").max(32, "Max. 32 characters"),
    newPassword: z.string().min(8, "Min. 8 characters").max(32, "Max. 32 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>
