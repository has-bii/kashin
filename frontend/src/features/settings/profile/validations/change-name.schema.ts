import { z } from "zod/v4"

export const changeNameSchema = z.object({
  name: z.string().min(6, "Min. 6 karakter").max(32, "Maks. 32 karakter"),
})

export type ChangeNameDto = z.infer<typeof changeNameSchema>
