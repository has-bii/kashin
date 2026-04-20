import { createBankAccountApi, deleteBankAccountApi } from "../api"
import { BANK_ACCOUNT_QUERY_KEY } from "../query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateBankAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBankAccountApi,
    onSuccess: () => {
      toast.success("Bank account added")
      queryClient.invalidateQueries({ queryKey: [BANK_ACCOUNT_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to add bank account"),
  })
}

export const useDeleteBankAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, deleteTransactions }: { id: string; deleteTransactions: boolean }) =>
      deleteBankAccountApi(id, deleteTransactions),
    onSuccess: (data) => {
      toast.success(`${data.bank.name} bank account deleted`)
      queryClient.invalidateQueries({ queryKey: [BANK_ACCOUNT_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: (e) => toast.error(e.message || "Failed to delete bank account"),
  })
}
