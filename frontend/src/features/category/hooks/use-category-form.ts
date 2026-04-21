import { useUpsertCategoryMutation } from "../mutations"
import { Category } from "../types"
import { categorySchema } from "../validations/schema"
import { CATEGORY_COLORS } from "@/constants/category-colors"
import { TransactionType } from "@/types/enums"
import { useForm } from "@tanstack/react-form"

interface UseCategoryForm {
  prevData?: Category | null
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
}

export const useCategoryForm = ({ prevData, options }: UseCategoryForm) => {
  const mutation = useUpsertCategoryMutation(prevData?.id)

  const form = useForm({
    defaultValues: {
      name: prevData?.name || "",
      icon: prevData?.icon || "🍔",
      color: prevData?.color || CATEGORY_COLORS[0].background,
      type: (prevData?.type || "expense") as TransactionType,
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutation.mutateAsync(value, options)
      formApi.reset()
    },
  })

  return { form, mutation }
}
