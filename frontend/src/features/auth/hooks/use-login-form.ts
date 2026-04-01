import { loginSchema } from "../validations/login.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

export const useLoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        const { error } = await authClient.signIn.email(value)

        if (error) {
          setError(error.message ?? "Unexpected error has occurred")
          return
        }
        router.refresh()
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message ?? "Unexpected error has occurred")
        } else setError("Unexpected error has occurred")
      } finally {
        form.reset()
      }
    },
  })

  const loginWithGoogle = useCallback(async () => {
    try {
      setError("")
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: process.env.NEXT_PUBLIC_APP_URL,
      })

      if (error) {
        setError(error.message ?? "Unexpected error has occurred")
        return
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message ?? "Unexpected error has occurred")
      } else {
        setError("Unexpected error has occurred")
      }
    }
  }, [])

  return { form, error, loginWithGoogle }
}
