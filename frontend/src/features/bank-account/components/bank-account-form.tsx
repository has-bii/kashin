"use client"

import { useBankAccountForm } from "../hooks/use-bank-account-form"
import type { BankAccount } from "../types"
import { BankPicker, BankPickerSkeleton } from "@/components/bank-picker"
import { ResponsiveDialogFooter } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { currencyToNumber, formatCurrency } from "@/utils/format-amount"
import { Loader2, Plus } from "lucide-react"
import { Suspense } from "react"

type Props = { prevData?: BankAccount | null; onSuccess?: () => void }

export function BankAccountForm({ prevData, onSuccess }: Props) {
  const { form } = useBankAccountForm({ prevData, options: { onSuccess } })

  return (
    <>
      <form
        id="bank-account-form"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4 px-4 md:px-0"
      >
        <FieldGroup>
          <form.Field
            name="initialBalance"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Initial Balance</FieldLabel>
                  <Input
                    id={field.name}
                    value={formatCurrency(field.state.value || 0)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(currencyToNumber(e.target.value))}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="bankId"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet>
                  <FieldLegend>Bank</FieldLegend>
                  <Suspense fallback={<BankPickerSkeleton />}>
                    <BankPicker
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    />
                  </Suspense>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          />
        </FieldGroup>
      </form>
      <ResponsiveDialogFooter>
        <form.Subscribe
          children={({ canSubmit, isDirty, isSubmitting }) => (
            <Button
              type="submit"
              form="bank-account-form"
              disabled={!canSubmit || !isDirty || isSubmitting}
            >
              {!prevData ? "Add" : "Save"}{" "}
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
            </Button>
          )}
        />
      </ResponsiveDialogFooter>
    </>
  )
}
