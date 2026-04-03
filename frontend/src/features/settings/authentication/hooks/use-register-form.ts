import { changePasswordSchema } from "../validations/change-password.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

export const useChangePasswordForm = () => {
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.changePassword({
          currentPassword: value.oldPassword,
          newPassword: value.newPassword,
        })

        if (error) {
          toast.error(error.message ?? "Unexpected error has occurred")
          return
        }

        toast.success("Password has been changed successfully")
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message ?? "Unexpected error has occurred")
        } else toast.error("Unexpected error has occurred")
      }
    },
  })

  return { form }
}
