import { z } from "zod/v4"

export const watchFiltersSchema = z.object({
  subjectKeywords: z.array(z.string()),
  gmailLabels: z.array(z.string()),
})

export type WatchFiltersFormDto = z.infer<typeof watchFiltersSchema>
