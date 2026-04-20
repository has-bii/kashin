"use client"

import { useBudgetForm } from "../hooks/use-budget-form"
import { Budget } from "../types"
import { ResponsiveDialogFooter, useResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategoriesQueryOptions } from "@/features/category/api/get-categories.api"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Loader2, Plus, SaveIcon } from "lucide-react"

const PERIOD_OPTIONS = [
  { label: "Harian", value: "daily" },
  { label: "Mingguan", value: "weekly" },
  { label: "Bulanan", value: "monthly" },
] as const

type Props = { mode: "create" } | { mode: "update"; data: Budget | null }

export default function BudgetForm(props: Props) {
  const { setOpen } = useResponsiveDialog()
  const closeDialog = () => setOpen(false)

  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions({ type: null }))

  const hookArgs =
    props.mode === "create"
      ? { mode: "create" as const, onSuccess: closeDialog }
      : { mode: "update" as const, prevData: props.data, onSuccess: closeDialog }

  const { form } = useBudgetForm(hookArgs)

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
                  <FieldLabel htmlFor={field.name}>Kategori</FieldLabel>
                  <Select value={field.state.value} onValueChange={field.handleChange}>
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Pilih kategori" />
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
                  <FieldLabel htmlFor={field.name}>Jumlah Anggaran</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min={0.01}
                    step={0.01}
                    aria-invalid={isInvalid}
                    placeholder="e.g. 500"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(parseFloat(e.target.value))}
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
                  <FieldLabel htmlFor={field.name}>Periode</FieldLabel>
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
                  <FieldLabel htmlFor={field.name}>Batas Peringatan</FieldLabel>
                  <InputGroup aria-invalid={isInvalid}>
                    <InputGroupInput
                      id={field.name}
                      type="number"
                      min={1}
                      max={100}
                      step={1}
                      aria-invalid={isInvalid}
                      placeholder="80"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(parseInt(e.target.value, 10))}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
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
                Batal
              </Button>
              <Button
                form="budget-form"
                type="submit"
                size="lg"
                disabled={isSubmitting || !canSubmit || !isDirty}
              >
                {props.mode === "create" ? (
                  <>Tambah {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}</>
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
