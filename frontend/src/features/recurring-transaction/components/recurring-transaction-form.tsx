"use client"

import { useRecurringTransactionForm } from "../hooks/use-recurring-transaction-form"
import { RecurringTransaction } from "../types"
import { RecurringTransactionDeleteDialog } from "./recurring-transaction-delete-dialog"
import { DatetimePicker, DatetimePickerDate, DatetimePickerTime } from "@/components/datetime-picker"
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
import { getCategoriesQueryOptions } from "@/features/category/api/get-categories.query"
import { TransactionType } from "@/types/enums"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Plus, SaveIcon } from "lucide-react"

const types: Array<{ label: string; value: TransactionType }> = [
  { label: "Pengeluaran", value: "expense" },
  { label: "Pemasukan", value: "income" },
]

const frequencies = [
  { label: "Mingguan", value: "weekly" },
  { label: "Dua Mingguan", value: "biweekly" },
  { label: "Bulanan", value: "monthly" },
  { label: "Tahunan", value: "yearly" },
] as const

type Props =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "edit"; data: RecurringTransaction; onSuccess?: () => void }

export function RecurringTransactionForm(props: Props) {
  const { form } = useRecurringTransactionForm(
    props.mode === "create"
      ? { mode: "create", onSuccess: props.onSuccess }
      : { mode: "edit", data: props.data, onSuccess: props.onSuccess },
  )

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
                  <FieldLabel htmlFor={field.name}>Jumlah</FieldLabel>
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
                  <FieldLabel htmlFor={field.name}>Frekuensi</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(
                        value as "weekly" | "biweekly" | "monthly" | "yearly",
                      )
                    }
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid} onBlur={field.handleBlur} className="w-full">
                      <SelectValue placeholder="Pilih frekuensi" />
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
                      <FieldLabel htmlFor={`date-${field.name}`}>Tanggal Jatuh Tempo</FieldLabel>
                      <DatetimePickerDate />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`time-${field.name}`}>Waktu</FieldLabel>
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
                  <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    maxLength={255}
                    placeholder="cth. Langganan Netflix"
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
              {props.mode === "create" ? (
                <>Tambah {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}</>
              ) : (
                <>Simpan {isSubmitting ? <Loader2 className="animate-spin" /> : <SaveIcon />}</>
              )}
            </Button>
          )}
        />

        {props.mode === "edit" && (
          <RecurringTransactionDeleteDialog
            recurringTransactionId={props.data.id}
            onSuccess={props.onSuccess}
          />
        )}
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
      <FieldLabel htmlFor={fieldName}>Kategori</FieldLabel>
      <Select value={value ?? "__none__"} onValueChange={onChange}>
        <SelectTrigger id={fieldName} aria-invalid={isInvalid} onBlur={onBlur} className="w-full">
          <SelectValue placeholder="Tanpa Kategori" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="__none__">Tanpa Kategori</SelectItem>
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
