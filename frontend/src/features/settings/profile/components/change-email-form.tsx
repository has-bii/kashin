"use client"

import { useChangeEmailForm } from "../hooks/use-change-email-form"
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
import { Loader2 } from "lucide-react"
import { useMemo } from "react"

export default function ChangeEmailForm() {
  const { data, isPending } = authClient.useSession()

  const defaultValues = useMemo(() => ({ email: data?.user.email ?? "" }), [data])

  const { form } = useChangeEmailForm({ defaultValues })

  return (
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
              name="email"
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
  )
}
