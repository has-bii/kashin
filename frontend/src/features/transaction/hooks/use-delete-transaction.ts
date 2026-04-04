import { Transaction } from "../types"
import { api } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type Args = {
  onSuccess?: () => void
}

const transactionDeleteApi = async (id: string) => {
  const { data } = await api.delete<Transaction>(`/transaction/${id}`)
  return data
}

export const useDeleteTransaction = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionDeleteApi,
    onSuccess: () => {
      toast.success("Transaction has been deleted")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to delete transaction")
    },
  })
}
