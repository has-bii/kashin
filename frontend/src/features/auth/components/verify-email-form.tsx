"use client"

import { useVerifyEmailForm } from "../hooks/use-verify-email-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CircleCheck, InfoIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email")

  useEffect(() => {
    if (!email) {
      router.replace("/auth/register")
    }
  }, [email, router])

  if (!email) {
    return null
  }

  return <VerifyEmailFormInner email={email} />
}

function VerifyEmailFormInner({ email }: { email: string }) {
  const { form, error, resendOtp, resendCooldown, isSuccess } = useVerifyEmailForm(email)

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground text-sm text-balance">
            We sent a verification code to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>
        {isSuccess && (
          <Alert className="text-emerald-600">
            <CircleCheck />
            <AlertTitle>Email verified</AlertTitle>
            <AlertDescription className="text-emerald-600/90">
              Your email has been verified successfully. You can now log in.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isSuccess && (
          <>
            <form.Field
              name="otp"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Verification Code</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      className="text-center text-lg tracking-widest"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Subscribe
              children={({ isSubmitting, canSubmit, isDirty }) => (
                <Field>
                  <Button type="submit" disabled={isSubmitting || !canSubmit || !isDirty}>
                    Verify
                    {isSubmitting && <Loader2 className="animate-spin" />}
                  </Button>
                </Field>
              )}
            />
          </>
        )}
        <Field>
          {!isSuccess && (
            <Button
              variant="outline"
              type="button"
              onClick={resendOtp}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
            </Button>
          )}
          <FieldDescription className="text-center">
            <Link href="/auth/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
