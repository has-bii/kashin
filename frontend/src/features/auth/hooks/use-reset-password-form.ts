import { resetPasswordSchema } from "../validations/reset-password.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useCallback, useEffect, useRef, useState } from "react"

export const useResetPasswordForm = (email: string) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (resendCooldown <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [resendCooldown])

  const form = useForm({
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        const { error } = await authClient.emailOtp.resetPassword({
          email,
          otp: value.otp,
          password: value.password,
        })

        if (error) {
          setError(error.message ?? "Unexpected error has occurred")
          return
        }

        setIsSuccess(true)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message ?? "Unexpected error has occurred")
        } else setError("Unexpected error has occurred")
      }
    },
  })

  const resendOtp = useCallback(async () => {
    if (resendCooldown > 0) return

    try {
      setError("")
      await authClient.emailOtp.requestPasswordReset({
        email,
      })
      setResendCooldown(60)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message ?? "Unexpected error has occurred")
      } else {
        setError("Unexpected error has occurred")
      }
    }
  }, [email, resendCooldown])

  return { form, error, resendOtp, resendCooldown, isSuccess }
}
