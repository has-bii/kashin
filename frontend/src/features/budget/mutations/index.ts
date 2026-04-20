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
      toast.success(
        `Budget untuk ${data.category?.name ?? "kategori"} telah ${id ? "diperbarui" : "dibuat"}`,
      )
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
    },
    onError: (e) => {
      toast.error(e.message || "Gagal menyimpan anggaran")
    },
  })
}

export const useDeleteBudgetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBudgetApi,
    onSuccess: (data) => {
      toast.success(`Budget untuk ${data.category?.name ?? "kategori"} telah dihapus`)
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
    },
    onError: (e) => {
      toast.error(e.message || "Gagal menghapus anggaran")
    },
  })
}
