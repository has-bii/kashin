import {
  bulkDeleteTransactionsApi,
  createTransactionApi,
  deleteTransactionApi,
  updateTransactionApi,
} from "../api"
import { TRANSACTIONS_QUERY_KEY } from "../query"
import { TransactionDto } from "../validations/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUpsertTransactionMutation = (id?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TransactionDto) => {
      if (id) return updateTransactionApi({ id, input })
      return createTransactionApi(input)
    },
    onSuccess: () => {
      toast.success(id ? "Transaction updated" : "Transaction added")
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
    },
    onError: (e) =>
      toast.error(e.message || (id ? "Failed to update transaction" : "Failed to add transaction")),
  })
}

export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTransactionApi(id),
    onSuccess: () => {
      toast.success("Transaction deleted")
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to delete transaction"),
  })
}

export const useBulkDeleteTransactionsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTransactionsApi(ids),
    onSuccess: () => {
      toast.success("Selected transactions deleted")
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to delete selected transactions"),
  })
}
