import { RecurringTransaction } from "../types"
import { api } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const recurringTransactionToggleApi = async (id: string) => {
  const { data } = await api.patch<RecurringTransaction>(`/recurring-transaction/${id}/toggle`)
  return data
}

export const useToggleRecurringTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recurringTransactionToggleApi,
    onSuccess: (data) => {
      const status = data.isActive ? "activated" : "paused"
      toast.success(`Recurring transaction ${status}`)
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] })
    },
    onError: () => {
      toast.error("Failed to update recurring transaction")
    },
  })
}
