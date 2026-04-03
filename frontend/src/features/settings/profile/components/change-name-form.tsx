"use client"

import { useChangeNameForm } from "../hooks/use-change-name-form"
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

export default function ChangeNameForm() {
  const { data, isPending } = authClient.useSession()

  const defaultValues = useMemo(() => ({ name: data?.user.name ?? "" }), [data])

  const { form } = useChangeNameForm({ defaultValues })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Name</CardTitle>
        <CardDescription>
          Please enter your full name, or a display name you are comfortable with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="change-name-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
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
                      placeholder="Full name or display name"
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
        <CardDescription>Please use 32 characters at maximum.</CardDescription>
        <form.Subscribe
          children={({ isSubmitting, isDirty, canSubmit }) => (
            <Button
              type="submit"
              form="change-name-form"
              disabled={isSubmitting || !isDirty || !canSubmit || isPending}
            >
              Save
              {isSubmitting && <Loader2 className="animate-spin" />}
            </Button>
          )}
        />
      </CardFooter>
    </Card>
  )
}
