import { getCategoriesQueryKey } from "../api/get-categories.query"
import { Category } from "../types"
import { api } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const categoryDeleteApi = async (id: string) => {
  const { data } = await api.delete<Category>(`/category/${id}`)
  return data
}

type Args = {
  onSuccess?: () => void
}

export const useCategoryDelete = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryDeleteApi,
    onSuccess: (data) => {
      toast.success(`${data.name} category has been deleted`)
      queryClient.invalidateQueries({
        queryKey: getCategoriesQueryKey({ type: null }),
      })
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to delete category")
    },
  })
}
