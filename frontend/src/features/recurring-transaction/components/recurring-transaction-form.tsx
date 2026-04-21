"use client"

import { useRecurringTransactionForm } from "../hooks/use-recurring-transaction-form"
import { RecurringTransaction } from "../types"
import {
  DatetimePicker,
  DatetimePickerDate,
  DatetimePickerTime,
} from "@/components/datetime-picker"
import { ResponsiveDialogFooter } from "@/components/responsive-dialog"
import { SelectTab, SelectTabItem } from "@/components/select-tab"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategoriesQueryOptions } from "@/features/category/query"
import { TransactionType } from "@/types/enums"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Plus, SaveIcon } from "lucide-react"

const types: Array<{ label: string; value: TransactionType }> = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
]

const frequencies = [
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const

type Props = {
  prevData?: RecurringTransaction | null
  onSuccess?: () => void
}

export function RecurringTransactionForm({ prevData, onSuccess }: Props) {
  const { form } = useRecurringTransactionForm({ prevData, options: { onSuccess } })

  return (
    <>
      <form
        id="recurring-transaction-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          {/* Type */}
          <form.Field
            name="type"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <SelectTab
                    value={field.state.value}
                    onChangeValue={(value) => field.handleChange(value as TransactionType)}
                  >
                    {types.map((type) => (
                      <SelectTabItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectTabItem>
                    ))}
                  </SelectTab>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Amount */}
          <form.Field
            name="amount"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    inputMode="decimal"
                    value={field.state.value === 0 ? "" : String(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const parsed = parseFloat(e.target.value)
                      field.handleChange(isNaN(parsed) ? 0 : parsed)
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    placeholder="0.00"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Frequency */}
          <form.Field
            name="frequency"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Frequency</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as "weekly" | "biweekly" | "monthly" | "yearly")
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {frequencies.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Next Due Date */}
          <form.Field
            name="nextDueDate"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="grid grid-cols-2 gap-2">
                  <DatetimePicker
                    value={field.state.value}
                    onChangeValue={(input) => field.handleChange(input!)}
                  >
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={`date-${field.name}`}>Next Due Date</FieldLabel>
                      <DatetimePickerDate />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`time-${field.name}`}>Time</FieldLabel>
                      <DatetimePickerTime />
                    </Field>
                  </DatetimePicker>
                </div>
              )
            }}
          />

          {/* Category — filtered by type */}
          <form.Subscribe
            selector={(state) => state.values.type}
            children={(currentType) => (
              <form.Field
                name="categoryId"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <CategorySelectField
                      fieldName={field.name}
                      value={field.state.value}
                      currentType={currentType as TransactionType}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      onBlur={field.handleBlur}
                      onChange={(value) => field.handleChange(value === "__none__" ? null : value)}
                    />
                  )
                }}
              />
            )}
          />

          {/* Description */}
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    maxLength={255}
                    placeholder="e.g. Netflix subscription"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </form>

      <ResponsiveDialogFooter className="flex-col sm:flex-col">
        <form.Subscribe
          children={({ canSubmit, isSubmitting }) => (
            <Button
              form="recurring-transaction-form"
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !canSubmit}
            >
              {prevData ? (
                <>Save {isSubmitting ? <Loader2 className="animate-spin" /> : <SaveIcon />}</>
              ) : (
                <>Add {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}</>
              )}
            </Button>
          )}
        />
      </ResponsiveDialogFooter>
    </>
  )
}

function CategorySelectField({
  fieldName,
  value,
  currentType,
  isInvalid,
  errors,
  onBlur,
  onChange,
}: {
  fieldName: string
  value: string | null
  currentType: TransactionType
  isInvalid: boolean
  errors: Array<{ message?: string } | undefined>
  onBlur: () => void
  onChange: (value: string) => void
}) {
  const { data: categories = [] } = useQuery(getCategoriesQueryOptions({ type: currentType }))

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={fieldName}>Category</FieldLabel>
      <Select value={value ?? "__none__"} onValueChange={onChange}>
        <SelectTrigger id={fieldName} aria-invalid={isInvalid} onBlur={onBlur} className="w-full">
          <SelectValue placeholder="No Category" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="__none__">No Category</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}
