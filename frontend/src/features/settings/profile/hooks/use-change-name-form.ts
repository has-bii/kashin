import { changeNameSchema } from "../validations/change-name.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

type UseChangeNameForm = {
  defaultValues: {
    name: string
  }
}

export const useChangeNameForm = ({ defaultValues }: UseChangeNameForm) => {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: changeNameSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.updateUser({
          name: value.name,
        })

        if (error) {
          toast.error(error.message ?? "Unexpected error has occurred")
          return
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message ?? "Unexpected error has occurred")
        } else toast.error("Unexpected error has occurred")
      } finally {
        form.reset()
      }
    },
  })

  return { form }
}
