import {
  createRecurringTransactionApi,
  deleteRecurringTransactionApi,
  toggleRecurringTransactionApi,
  updateRecurringTransactionApi,
} from "../api"
import { RECURRING_TRANSACTIONS_QUERY_KEY } from "../query"
import { RecurringTransactionDto } from "../validations/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUpsertRecurringTransactionMutation = (id?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RecurringTransactionDto) => {
      if (id) return updateRecurringTransactionApi({ id, input })
      return createRecurringTransactionApi(input)
    },
    onSuccess: () => {
      toast.success(id ? "Recurring transaction updated" : "Recurring transaction added")
      queryClient.invalidateQueries({ queryKey: [RECURRING_TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) =>
      toast.error(
        e.message ||
          (id ? "Failed to update recurring transaction" : "Failed to add recurring transaction"),
      ),
  })
}

export const useDeleteRecurringTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRecurringTransactionApi(id),
    onSuccess: () => {
      toast.success("Recurring transaction deleted")
      queryClient.invalidateQueries({ queryKey: [RECURRING_TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to delete recurring transaction"),
  })
}

export const useToggleRecurringTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleRecurringTransactionApi(id),
    onSuccess: (data) => {
      const status = data.isActive ? "activated" : "paused"
      toast.success(`Recurring transaction ${status}`)
      queryClient.invalidateQueries({ queryKey: [RECURRING_TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to update recurring transaction"),
  })
}
