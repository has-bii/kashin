import { z } from "zod/v4"

export const changeEmailSchema = z.object({
  newEmail: z.email(),
})

export type ChangeEmailDto = z.infer<typeof changeEmailSchema>
