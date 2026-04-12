"use client"

import { useResetPasswordForm } from "../hooks/use-reset-password-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CircleCheck, InfoIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email")

  useEffect(() => {
    if (!email) {
      router.replace("/auth/forgot-password")
    }
  }, [email, router])

  if (!email) {
    return null
  }

  return <ResetPasswordFormInner email={email} />
}

function ResetPasswordFormInner({ email }: { email: string }) {
  const { form, error, resendOtp, resendCooldown, isSuccess } = useResetPasswordForm(email)

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
          <h1 className="text-2xl font-bold">Atur Ulang Kata Sandi</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masukkan kode yang dikirim ke <span className="text-foreground font-medium">{email}</span> beserta kata sandi baru Anda
          </p>
        </div>
        {isSuccess && (
          <Alert className="text-emerald-600">
            <CircleCheck />
            <AlertTitle>Kata Sandi Diperbarui</AlertTitle>
            <AlertDescription className="text-emerald-600/90">
              Kata sandi Anda berhasil diperbarui. Silakan masuk kembali.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
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
                    <FieldLabel htmlFor={field.name}>Kode Verifikasi</FieldLabel>
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
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Kata Sandi Baru</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      autoComplete="new-password"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Konfirmasi Kata Sandi</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      autoComplete="new-password"
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
                    Atur Ulang Kata Sandi
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
              {resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}d)` : "Kirim Ulang Kode"}
            </Button>
          )}
          <FieldDescription className="text-center">
            <Link href="/auth/login" className="underline underline-offset-4">
              Kembali ke halaman masuk
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
