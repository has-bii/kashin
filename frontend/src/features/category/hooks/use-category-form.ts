import { Category } from "../types"
import { CategoryDto, categorySchema } from "../validations/schema"
import { CATEGORY_COLORS } from "@/constants/category-colors"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

type Args =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "update"; prevData: Category | null; onSuccess?: () => void }

const categoryApi = async (mode: "create" | "update", input: CategoryDto, id?: string) => {
  if (mode === "create") {
    const { data } = await api.post<Category>("/category", input)
    return data
  }
  const { data } = await api.put<Category>(`/category/${id}`, input)
  return data
}

export const useCategoryForm = (args: Args) => {
  const queryClient = useQueryClient()

  const prevData = args.mode === "update" ? args.prevData : null

  const form = useForm({
    defaultValues: {
      name: prevData?.name ?? "",
      icon: prevData?.icon ?? "🍔",
      color: prevData?.color ?? CATEGORY_COLORS[0],
      type: (prevData?.type ?? "expense") as TransactionType,
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      if (args.mode === "update" && !prevData) return
      const id = prevData?.id
      await mutation.mutateAsync({ input: value, id }, { onSuccess: args.onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: ({ input, id }: { input: CategoryDto; id?: string }) =>
      categoryApi(args.mode, input, id),
    onSuccess: (data) => {
      const verb = args.mode === "create" ? "added" : "updated"
      toast.success(`${data.name} category has been ${verb} successfully`)
      form.reset()
      queryClient.invalidateQueries({
        queryKey: ["categories"],
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
