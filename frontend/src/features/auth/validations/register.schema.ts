import { z } from "zod/v4"

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Max. 100 characters"),
    email: z.email(),
    password: z.string().min(8, "Min. 8 characters").max(32, "Max. 32 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterDto = z.infer<typeof registerSchema>
