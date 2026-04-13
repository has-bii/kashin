import { loginSchema } from "../validations/login.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"

export const useLoginForm = () => {
  const router = useRouter()
  const [isPasskeyLoading, startTransition] = useTransition()
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
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        errorCallbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
        scopes: [
          "openid",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
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

  const loginWithPasskey = useCallback(() => {
    setError("")

    startTransition(async () => {
      await authClient.signIn.passkey({
        fetchOptions: {
          onSuccess: () => {
            router.refresh()
          },
          onError: (context) => {
            setError(context.error.message)
          },
        },
      })
    })
  }, [router])

  return { form, error, loginWithGoogle, loginWithPasskey, isPasskeyLoading }
}
