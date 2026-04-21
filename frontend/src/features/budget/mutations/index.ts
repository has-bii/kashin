import { createBudgetApi, deleteBudgetApi, updateBudgetApi } from "../api"
import { BUDGET_QUERY_KEY } from "../query"
import { BudgetDto } from "../validations/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUpsertBudgetMutation = (id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BudgetDto) => {
      const payload = { ...input, alertThreshold: input.alertThreshold / 100 }
      if (id) return updateBudgetApi(id, payload)
      return createBudgetApi(payload)
    },
    onSuccess: (data) => {
      toast.success(`${data.category.name} budget has been ${id ? "updated" : "created"}`)
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
    },
    onError: (e) => {
      toast.error(e.message || "Unexpected error has been occurred")
    },
  })
}

export const useDeleteBudgetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBudgetApi,
    onSuccess: (data) => {
      toast.success(`${data.category.name} has been deleted`)
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
    },
    onError: (e) => {
      toast.error(e.message || "Unexpected error has been occurred")
    },
  })
}
