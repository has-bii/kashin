import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteBankAccountApi } from "../api/bank-account.api"

type Args = {
  onSuccess?: () => void
}

export const useDeleteBankAccount = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, deleteTransactions }: { id: string; deleteTransactions: boolean }) =>
      deleteBankAccountApi(id, deleteTransactions),
    onSuccess: () => {
      toast.success("Bank account deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to delete bank account")
    },
  })
}
