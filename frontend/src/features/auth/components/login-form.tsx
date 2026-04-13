"use client"

import { useLoginForm } from "../hooks/use-login-form"
import Google from "@/components/svgs/google"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Fingerprint, InfoIcon, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const { form, loginWithGoogle, error, isPasskeyLoading, loginWithPasskey } = useLoginForm()

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
          <h1 className="text-2xl font-bold">Masuk ke akun Anda</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masukkan email Anda untuk melanjutkan
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
                  autoComplete="off"
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
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Kata Sandi</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  type="password"
                  autoComplete="off"
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
                Masuk
                {isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            </Field>
          )}
        />
        <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={loginWithGoogle}>
            <Google />
            Masuk dengan Google
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={loginWithPasskey}
            disabled={isPasskeyLoading}
          >
            {isPasskeyLoading ? <Loader2 className="animate-spin" /> : <Fingerprint />}
            Masuk dengan Passkey
          </Button>
          <FieldDescription className="text-center">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              Daftar
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
