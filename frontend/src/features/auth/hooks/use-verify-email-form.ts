import { verifyEmailSchema } from "../validations/verify-email.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

export const useVerifyEmailForm = (email: string) => {
  const router = useRouter()
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
    },
    validators: {
      onSubmit: verifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        const { error } = await authClient.emailOtp.verifyEmail({
          email,
          otp: value.otp,
        })

        if (error) {
          setError(error.message ?? "Unexpected error has occurred")
          return
        }

        router.push("/auth/login?verified=true")
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
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
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

  return { form, error, resendOtp, resendCooldown }
}
