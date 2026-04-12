'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus } from 'lucide-react'
import { useBankAccountForm } from '../hooks/use-bank-account-form'

const BANK_OPTIONS = [
  { value: 'bca', label: 'BCA' },
  { value: 'jago', label: 'Jago' },
  { value: 'cash', label: 'Cash' },
] as const

type Props = { mode: 'create'; onSuccess?: () => void }

export function BankAccountForm(props: Props) {
  const { form } = useBankAccountForm(props)

  return (
    <form
      id="bank-account-form"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <form.Field
          name="bankName"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Bank</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as typeof field.state.value)}
                >
                  <SelectTrigger id={field.name} onBlur={field.handleBlur}>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {BANK_OPTIONS.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="initialBalance"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Initial balance</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="0"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <form.Subscribe
        children={({ canSubmit, isDirty, isSubmitting }) => (
          <Button
            type="submit"
            form="bank-account-form"
            disabled={!canSubmit || !isDirty || isSubmitting}
          >
            Add {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
          </Button>
        )}
      />
    </form>
  )
}
