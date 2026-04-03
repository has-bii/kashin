import { getCategoriesQueryKey } from "../api/get-categories.query"
import { Category } from "../types"
import { CategoryCreateDto, categoryCreateSchema } from "../validations/schema"
import { CATEGORY_COLORS } from "@/constants/category-colors"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

const categoryCreateApi = async (input: CategoryCreateDto) => {
  const { data } = await api.post<Category>("/category", input)

  return data
}

type Args = {
  onSuccess?: () => void
}

export const useCategoryCreateForm = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      name: "",
      icon: "🍔",
      color: CATEGORY_COLORS[0],
      type: "expense" as TransactionType,
    },
    validators: {
      onSubmit: categoryCreateSchema!,
    },
    onSubmit: async ({ value }) => await mutation.mutateAsync(value, { onSuccess }),
  })

  const mutation = useMutation({
    mutationFn: categoryCreateApi,
    onSuccess: (data) => {
      toast.success(`${data.name} category has been added successfully`)
      form.reset()
      queryClient.invalidateQueries({
        queryKey: getCategoriesQueryKey(),
      })
    },
    onError: (error) => {
      let message: string = "Unexpected error has occurred"
      if (isAxiosError(error)) {
        switch (error.status) {
          case 409:
            message = "Category with the same name already exits"
            break

          default:
            break
        }
      } else {
        message = error.message
      }

      toast.error(message)
    },
  })

  return { form, mutation }
}
