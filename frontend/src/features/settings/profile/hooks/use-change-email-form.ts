import { changeEmailSchema } from "../validations/change-email.schema"
import { verifyEmailSchema } from "@/features/auth/validations/verify-email.schema"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

type DialogStep = "idle" | "verify-current" | "verify-new"

type Props = {
  defaultValues: {
    newEmail: string
  }
  currentEmail: string
}

export const useChangeEmailForm = ({ defaultValues, currentEmail }: Props) => {
  const [dialogStep, setDialogStep] = useState<DialogStep>("idle")
  const [pendingNewEmail, setPendingNewEmail] = useState("")
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
    defaultValues,
    validators: {
      onSubmit: changeEmailSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.emailOtp.sendVerificationOtp({
          email: currentEmail,
          type: "email-verification",
        })

        if (error) {
          toast.error(error.message ?? "Unexpected error has occurred")
          return
        }

        setPendingNewEmail(value.newEmail)
        setDialogStep("verify-current")
        setResendCooldown(60)
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message ?? "Unexpected error has occurred")
        } else {
          toast.error("Unexpected error has occurred")
        }
      }
    },
  })

  const otpForm = useForm({
    defaultValues: { otp: "" },
    validators: {
      onSubmit: verifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")

        if (dialogStep === "verify-current") {
          const { error } = await authClient.emailOtp.requestEmailChange({
            newEmail: pendingNewEmail,
            otp: value.otp,
          })

          if (error) {
            setError(error.message ?? "Unexpected error has occurred")
            return
          }

          otpForm.reset()
          setDialogStep("verify-new")
          setResendCooldown(60)
        } else if (dialogStep === "verify-new") {
          const { error } = await authClient.emailOtp.changeEmail({
            newEmail: pendingNewEmail,
            otp: value.otp,
          })

          if (error) {
            setError(error.message ?? "Unexpected error has occurred")
            return
          }

          setDialogStep("idle")
          toast.success("Email changed successfully")
          form.reset()
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message ?? "Unexpected error has occurred")
        } else {
          setError("Unexpected error has occurred")
        }
      }
    },
  })

  const resendOtp = useCallback(async () => {
    if (resendCooldown > 0) return

    try {
      setError("")
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: currentEmail,
        type: "email-verification",
      })

      if (error) {
        setError(error.message ?? "Unexpected error has occurred")
        return
      }

      if (dialogStep === "verify-new") {
        otpForm.reset()
        setDialogStep("verify-current")
      }

      setResendCooldown(60)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? "Unexpected error has occurred")
      } else {
        setError("Unexpected error has occurred")
      }
    }
  }, [currentEmail, dialogStep, resendCooldown, otpForm])

  return {
    form,
    otpForm,
    dialogStep,
    setDialogStep,
    error,
    resendOtp,
    resendCooldown,
    pendingNewEmail,
  }
}
