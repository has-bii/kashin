import { z } from "zod/v4"

export const changeNameSchema = z.object({
  name: z.string().min(6, "Min. 6 characters").max(32, "Max. 32 characters"),
})

export type ChangeNameDto = z.infer<typeof changeNameSchema>
