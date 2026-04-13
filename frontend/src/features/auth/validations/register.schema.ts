import { z } from "zod/v4"

export const registerSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi").max(100, "Maks. 100 karakter"),
    email: z.email(),
    password: z.string().min(8, "Min. 8 karakter").max(32, "Maks. 32 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  })

export type RegisterDto = z.infer<typeof registerSchema>
