import { createCategoryApi, deleteCategoryApi, updateCategoryApi } from "../api"
import { CATEGORIES_QUERY_KEY } from "../query"
import { CategoryDto } from "../validations/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUpsertCategoryMutation = (id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CategoryDto) => {
      if (id) {
        return updateCategoryApi(id, input)
      }
      return createCategoryApi(input)
    },
    onSuccess: (data) => {
      toast.success(`${data.name} category has been ${id ? "updated" : "created"}`)
      queryClient.invalidateQueries({
        queryKey: [CATEGORIES_QUERY_KEY],
      })
    },
    onError: (e) => {
      toast.error(e.message || "Unexpected error has been occurred")
    },
  })
}

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: (data) => {
      toast.success(`${data.name} category has been deleted`)
      queryClient.invalidateQueries({
        queryKey: [CATEGORIES_QUERY_KEY],
      })
    },
    onError: (e) => {
      toast.error(e.message || "Unexpected error has been occurred")
    },
  })
}
