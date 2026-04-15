import { importStatusQueryKey } from "../api/get-import-status.query"
import { ImportEmailsDto, importEmailsSchema } from "../validations/schema"
import { api } from "@/lib/api"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { toast } from "sonner"

const importEmailsApi = async (input: ImportEmailsDto) => {
  const { data } = await api.post("/email-import", input)
  return data
}

export const useImportEmailsForm = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      after: subDays(new Date(), 30).toISOString(),
      before: new Date().toISOString(),
    },
    validators: { onSubmit: importEmailsSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value, { onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: importEmailsApi,
    onSuccess: () => {
      toast.success("Email import started")
      form.reset()
      queryClient.invalidateQueries({ queryKey: importStatusQueryKey() })
    },
    onError: () => {
      toast.error("Failed to start email import")
    },
  })

  return { form, mutation }
}
