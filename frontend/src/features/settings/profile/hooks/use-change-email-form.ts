import { changeEmailSchema } from "../validations/change-email.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

type Props = {
  defaultValues: {
    email: string
  }
}

export const useChangeEmailForm = ({ defaultValues }: Props) => {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: changeEmailSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.changeEmail({
          newEmail: value.email,
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
