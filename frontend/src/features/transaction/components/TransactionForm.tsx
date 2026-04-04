"use client"

import { useTransactionForm } from "../hooks/use-transaction-form"
import { Transaction } from "../types"
import { getCategoriesQueryOptions } from "@/features/category/api/get-categories.query"
import { authClient } from "@/lib/auth-client"
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
import { TransactionType } from "@/types/enums"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Plus, SaveIcon } from "lucide-react"
import { TransactionDeleteDialog } from "./TransactionDeleteDialog"

const types: Array<{ label: string; value: TransactionType }> = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
]

type Props =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "edit"; data: Transaction; onSuccess?: () => void }

export function TransactionForm(props: Props) {
  const { form } = useTransactionForm(
    props.mode === "create"
      ? { mode: "create", onSuccess: props.onSuccess }
      : { mode: "edit", data: props.data, onSuccess: props.onSuccess },
  )
  const { data: session } = authClient.useSession()
  const currency = (session?.user as { currency?: string } | undefined)?.currency ?? "IDR"

  return (
    <>
      <form
        id="transaction-form"
        className="flex-1 overflow-y-auto px-6 pb-4"
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
                    onSelect={(value) => field.handleChange(value as TransactionType)}
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
                  <FieldLabel htmlFor={field.name}>Amount ({currency})</FieldLabel>
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

          {/* Transaction Date */}
          <form.Field
            name="transactionDate"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Category — filtered by current type value */}
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
                    placeholder="e.g. Grocery shopping"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Notes */}
          <form.Field
            name="notes"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    rows={3}
                    placeholder="Optional notes..."
                    className="w-full rounded-2xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </form>

      <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
        <form.Subscribe
          children={({ canSubmit, isSubmitting }) => (
            <Button
              form="transaction-form"
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !canSubmit}
            >
              {props.mode === "create" ? (
                <>Add {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}</>
              ) : (
                <>Save {isSubmitting ? <Loader2 className="animate-spin" /> : <SaveIcon />}</>
              )}
            </Button>
          )}
        />

        {/* Delete dialog — edit mode only (D-03) */}
        {props.mode === "edit" && (
          <TransactionDeleteDialog
            transactionId={props.data.id}
            onSuccess={props.onSuccess}
          />
        )}
      </div>
    </>
  )
}

// Extracted so it can call useQuery at top level of its render
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
      <Select
        value={value ?? "__none__"}
        onValueChange={onChange}
      >
        <SelectTrigger id={fieldName} aria-invalid={isInvalid} onBlur={onBlur} className="w-full">
          <SelectValue placeholder="No category" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="__none__">No category</SelectItem>
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
