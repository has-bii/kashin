import { useToggleWatchMutation, useUpdateWatchFiltersMutation } from "../mutations"
import { GmailWatchConfig } from "../types"
import { watchFiltersSchema } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

export const useGmailWatchSettingsForm = (config: GmailWatchConfig) => {
  const toggleMutation = useToggleWatchMutation()
  const filtersMutation = useUpdateWatchFiltersMutation()

  const form = useForm({
    defaultValues: {
      subjectKeywords: config.subjectKeywords,
      gmailLabels: config.gmailLabels,
    },
    validators: { onSubmit: watchFiltersSchema },
    onSubmit: ({ value }) => {
      filtersMutation.mutate(value)
    },
  })

  return { form, filtersMutation, toggleMutation }
}
