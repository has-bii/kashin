import { api } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type Args = {
  onSuccess?: () => void
}

const recurringTransactionDeleteApi = async (id: string) => {
  const { data } = await api.delete(`/recurring-transaction/${id}`)
  return data
}

export const useDeleteRecurringTransaction = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recurringTransactionDeleteApi,
    onSuccess: () => {
      toast.success("Recurring transaction has been deleted")
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] })
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to delete recurring transaction")
    },
  })
}
