import { Budget } from '../types'
import { api } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

const getBudgets = async () => {
  const { data } = await api.get<Budget[]>('/budget')
  return data
}

export const getBudgetsQueryKey = () => ['budgets']

export const getBudgetsQueryOptions = () => {
  return queryOptions({
    queryKey: getBudgetsQueryKey(),
    queryFn: getBudgets,
  })
}
