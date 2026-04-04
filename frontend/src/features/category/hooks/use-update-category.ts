import { getCategoriesQueryKey } from "../api/get-categories.query"
import { Category } from "../types"
import { CategoryDto, categorySchema } from "../validations/schema"
import { CATEGORY_COLORS } from "@/constants/category-colors"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

interface Input {
  id: string
  input: CategoryDto
}

const categoryUpdateApi = async ({ id, input }: Input) => {
  const { data } = await api.put<Category>(`/category/${id}`, input)

  return data
}

type Args = {
  prevData: Category | null
  onSuccess?: () => void
}

export const useCategoryUpdateForm = ({ prevData, onSuccess }: Args) => {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      name: (prevData?.name as string) || "",
      icon: (prevData?.icon as string) || "🍔",
      color: (prevData?.color as string) || CATEGORY_COLORS[0],
      type: (prevData?.type as TransactionType) || ("expense" as TransactionType),
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      if (!prevData) return
      await mutation.mutateAsync({ id: prevData.id, input: value }, { onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: categoryUpdateApi,
    onSuccess: (data) => {
      toast.success(`${data.name} category has been updated successfully`)
      form.reset()
      queryClient.invalidateQueries({
        queryKey: getCategoriesQueryKey({ type: null }),
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
