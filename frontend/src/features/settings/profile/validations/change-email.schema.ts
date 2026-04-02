import { z } from "zod/v4"

export const changeEmailSchema = z.object({
  email: z.email(),
})

export type ChangeEmailDto = z.infer<typeof changeEmailSchema>
