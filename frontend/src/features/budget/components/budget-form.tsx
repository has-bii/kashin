"use client"

import { useBudgetForm } from "../hooks/use-budget-form"
import { Budget } from "../types"
import { ResponsiveDialogFooter, useResponsiveDialog } from "@/components/responsive-dialog"
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
import { Slider } from "@/components/ui/slider"
import { getCategoriesQueryOptions } from "@/features/category/query"
import { currencyToNumber, formatCurrency } from "@/utils/format-amount"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Loader2, Plus, SaveIcon } from "lucide-react"

const PERIOD_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
] as const

interface Props {
  prevData?: Budget | null
  mode: "create" | "update"
}

export default function BudgetForm(props: Props) {
  const { setOpen } = useResponsiveDialog()
  const closeDialog = () => setOpen(false)

  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions({ type: "expense" }))

  const { form } = useBudgetForm({
    prevData: props.prevData,
    options: {
      onSuccess: closeDialog,
    },
  })

  return (
    <>
      <form
        id="budget-form"
        className="px-4 pb-2 md:px-0"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          {/* Category */}
          <form.Field
            name="categoryId"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <Select value={field.state.value} onValueChange={field.handleChange}>
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span>{cat.icon}</span>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    aria-invalid={isInvalid}
                    value={formatCurrency(field.state.value || 0)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(currencyToNumber(e.target.value))}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Period */}
          <form.Field
            name="period"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Period</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as "daily" | "weekly" | "monthly")}
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Alert Threshold */}
          <form.Field
            name="alertThreshold"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Alert Threshold</FieldLabel>
                  <div className="inline-flex w-full items-center gap-2">
                    <Slider
                      id={field.name}
                      min={1}
                      max={100}
                      step={1}
                      aria-invalid={isInvalid}
                      value={[field.state.value]}
                      onValueChange={(value) => field.handleChange(value[0])}
                      onBlur={field.handleBlur}
                    />
                    <div className="shrink-0 font-medium" aria-label={field.name}>
                      {field.state.value} %
                    </div>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </form>

      <ResponsiveDialogFooter className="px-4 md:px-0">
        <form.Subscribe
          children={({ canSubmit, isDirty, isSubmitting }) => (
            <>
              <Button
                variant="secondary"
                type="button"
                size="lg"
                disabled={isSubmitting}
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                form="budget-form"
                type="submit"
                size="lg"
                disabled={isSubmitting || !canSubmit || !isDirty}
              >
                {props.mode === "create" ? (
                  <>Create {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}</>
                ) : (
                  <>Simpan {isSubmitting ? <Loader2 className="animate-spin" /> : <SaveIcon />}</>
                )}
              </Button>
            </>
          )}
        />
      </ResponsiveDialogFooter>
    </>
  )
}
