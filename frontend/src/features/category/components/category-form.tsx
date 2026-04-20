import { useCategoryForm } from "../hooks/use-category-form"
import { Category } from "../types"
import { ColorPicker } from "@/components/color-picker"
import { EmojiPicker } from "@/components/emoji-picker"
import { ResponsiveDialogFooter, useResponsiveDialog } from "@/components/responsive-dialog"
import { SelectTab, SelectTabItem } from "@/components/select-tab"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TransactionType } from "@/types/enums"
import { Loader2, Plus, SaveIcon } from "lucide-react"

const types: TransactionType[] = ["expense", "income"] as const

interface Props {
  prevData?: Category | null
  mode: "create" | "update"
}

export function CategoryForm(props: Props) {
  const { setOpen } = useResponsiveDialog()

  const closeDialog = () => setOpen(false)

  const { form } = useCategoryForm({
    prevData: props.prevData,
    options: {
      onSuccess: closeDialog,
    },
  })

  return (
    <>
      <form
        id="category-form"
        className="mb-4 px-4 md:px-0"
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
                      <SelectTabItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectTabItem>
                    ))}
                  </SelectTab>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Name */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    placeholder="cth. Makanan"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Color */}
          <form.Field
            name="color"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category Color</FieldLabel>
                  <ColorPicker value={field.state.value} onChangeValue={field.handleChange} />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Icon */}
          <form.Field
            name="icon"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category Icon</FieldLabel>
                  <EmojiPicker value={field.state.value} onChangeValue={field.handleChange} />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </form>

      <ResponsiveDialogFooter>
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
                form="category-form"
                type="submit"
                size="lg"
                disabled={isSubmitting || !canSubmit || !isDirty}
              >
                {props.mode === "create" ? (
                  <>Create {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}</>
                ) : (
                  <>Save {isSubmitting ? <Loader2 className="animate-spin" /> : <SaveIcon />}</>
                )}
              </Button>
            </>
          )}
        />
      </ResponsiveDialogFooter>
    </>
  )
}
