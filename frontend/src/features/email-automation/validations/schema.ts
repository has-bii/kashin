import { z } from "zod/v4"

export const importEmailsSchema = z.object({
  after: z.iso.datetime("Invalid datetime format"),
  before: z.iso.datetime("Invalid datetime format"),
})

export type ImportEmailsDto = z.infer<typeof importEmailsSchema>
