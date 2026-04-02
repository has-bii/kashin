import { forgotPasswordSchema } from "../validations/forgot-password.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const useForgotPasswordForm = () => {
  const router = useRouter()
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        const { error } = await authClient.emailOtp.requestPasswordReset({
          email: value.email,
        })

        if (error) {
          setError(error.message ?? "Unexpected error has occurred")
          return
        }

        router.push(`/auth/reset-password?email=${encodeURIComponent(value.email)}`)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message ?? "Unexpected error has occurred")
        } else setError("Unexpected error has occurred")
      }
    },
  })

  return { form, error }
}
