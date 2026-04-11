import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BankAccount } from '../types'

const bankAccountDeleteApi = async (id: string, deleteTransactions: boolean): Promise<BankAccount> => {
  const { data } = await api.delete<BankAccount>(`/bank-account/${id}`, {
    params: { deleteTransactions },
  })
  return data
}

type Args = {
  onSuccess?: () => void
}

export const useDeleteBankAccount = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, deleteTransactions }: { id: string; deleteTransactions: boolean }) =>
      bankAccountDeleteApi(id, deleteTransactions),
    onSuccess: (data) => {
      toast.success(`${data.displayName} bank account has been deleted`)
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to delete bank account')
    },
  })
}
