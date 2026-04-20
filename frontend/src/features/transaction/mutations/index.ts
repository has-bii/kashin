import {
  bulkDeleteTransactionsApi,
  createTransactionApi,
  deleteTransactionApi,
  updateTransactionApi,
} from "../api"
import { TRANSACTIONS_QUERY_KEY } from "../query"
import { TransactionCreateDto } from "../validations/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TransactionCreateDto) => createTransactionApi(input),
    onSuccess: () => {
      toast.success("Transaksi berhasil ditambahkan")
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
    },
    onError: (e) => toast.error(e.message || "Gagal menambahkan transaksi"),
  })
}

export const useUpdateTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TransactionCreateDto }) =>
      updateTransactionApi({ id, input }),
    onSuccess: () => {
      toast.success("Transaksi berhasil diperbarui")
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
    },
    onError: (e) => toast.error(e.message || "Gagal memperbarui transaksi"),
  })
}

export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTransactionApi(id),
    onSuccess: () => {
      toast.success("Transaksi berhasil dihapus")
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Gagal menghapus transaksi"),
  })
}

export const useBulkDeleteTransactionsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTransactionsApi(ids),
    onSuccess: () => {
      toast.success("Transaksi terpilih berhasil dihapus")
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Gagal menghapus transaksi terpilih"),
  })
}
