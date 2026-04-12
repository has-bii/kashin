"use client"

import { useForgotPasswordForm } from "../hooks/use-forgot-password-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InfoIcon, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordForm() {
  const { form, error } = useForgotPasswordForm()

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
          <h1 className="text-2xl font-bold">Lupa Kata Sandi?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masukkan email Anda dan kami akan mengirim kode untuk memulihkan kata sandi
          </p>
        </div>
        {error && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="me@example.com"
                  autoComplete="email"
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
                Kirim Kode Pemulihan
                {isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            </Field>
          )}
        />
        <Field>
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
