import { registerSchema } from "../validations/register.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

export const useRegisterForm = () => {
  const router = useRouter()
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        const { error } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
        })

        if (error) {
          setError(error.message ?? "Unexpected error has occurred")
          return
        }

        await authClient.emailOtp.sendVerificationOtp({
          email: value.email,
          type: "email-verification",
        })

        router.push(`/auth/verify-email?email=${encodeURIComponent(value.email)}`)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message ?? "Unexpected error has occurred")
        } else setError("Unexpected error has occurred")
      }
    },
  })

  const registerWithGoogle = useCallback(async () => {
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

  return { form, error, registerWithGoogle }
}
