import { Budget } from '../types'
import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const deleteBudgetApi = async (id: string) => {
  const { data } = await api.delete<Budget>(`/budget/${id}`)
  return data
}

type Args = {
  onSuccess?: () => void
}

export const useDeleteBudget = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBudgetApi,
    onSuccess: () => {
      toast.success('Budget has been deleted')
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to delete budget')
    },
  })
}
