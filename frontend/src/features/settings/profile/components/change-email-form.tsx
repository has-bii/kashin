"use client"

import { useChangeEmailForm } from "../hooks/use-change-email-form"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { InfoIcon, Loader2 } from "lucide-react"
import { useMemo } from "react"

export default function ChangeEmailForm() {
  const { data, isPending } = authClient.useSession()

  const currentEmail = data?.user.email ?? ""
  const defaultValues = useMemo(() => ({ newEmail: currentEmail }), [currentEmail])

  const {
    form,
    otpForm,
    dialogStep,
    setDialogStep,
    error,
    resendOtp,
    resendCooldown,
    pendingNewEmail,
  } = useChangeEmailForm({ defaultValues, currentEmail })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Enter the email address you want to use to log in with.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="change-email-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="newEmail"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder={currentEmail}
                        className="max-w-md"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Email must be verified to be able to login with.</CardDescription>
          <form.Subscribe
            children={({ isSubmitting, isDirty, canSubmit }) => (
              <Button
                type="submit"
                form="change-email-form"
                disabled={isSubmitting || !isDirty || !canSubmit || isPending}
              >
                Change
                {isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            )}
          />
        </CardFooter>
      </Card>

      <AlertDialog
        open={dialogStep !== "idle"}
        onOpenChange={(open) => !open && setDialogStep("idle")}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogStep === "verify-current"
                ? "Verify your current email"
                : "Verify your new email"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              We sent a verification code to{" "}
              <span className="text-foreground font-medium">
                {dialogStep === "verify-current" ? currentEmail : pendingNewEmail}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <Alert variant="destructive">
              <InfoIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            id="otp-form"
            onSubmit={(e) => {
              e.preventDefault()
              otpForm.handleSubmit()
            }}
          >
            <otpForm.Field
              name="otp"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
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
          </form>

          <AlertDialogFooter>
            <Button variant="outline" onClick={resendOtp} disabled={resendCooldown > 0}>
              {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <otpForm.Subscribe
              children={({ isSubmitting }) => (
                <Button type="submit" form="otp-form" disabled={isSubmitting}>
                  Verify
                  {isSubmitting && <Loader2 className="animate-spin" />}
                </Button>
              )}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
