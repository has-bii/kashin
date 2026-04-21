import { PaginatedRecurringTransactionResponse, RecurringTransaction } from "../types"
import { RecurringTransactionDto } from "../validations/schema"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"

export type GetRecurringTransactionsParams = {
  page?: number
  limit?: number
  type?: TransactionType | null
  isActive?: boolean | null
}

export const getRecurringTransactionsApi = async (params: GetRecurringTransactionsParams) => {
  const { data } = await api.get<PaginatedRecurringTransactionResponse>("/recurring-transaction", {
    params,
  })
  return data
}

export const createRecurringTransactionApi = async (input: RecurringTransactionDto) => {
  const { data } = await api.post<RecurringTransaction>("/recurring-transaction", input)
  return data
}

export const updateRecurringTransactionApi = async ({
  id,
  input,
}: {
  id: string
  input: RecurringTransactionDto
}) => {
  const { data } = await api.put<RecurringTransaction>(`/recurring-transaction/${id}`, input)
  return data
}

export const deleteRecurringTransactionApi = async (id: string) => {
  const { data } = await api.delete(`/recurring-transaction/${id}`)
  return data
}

export const toggleRecurringTransactionApi = async (id: string) => {
  const { data } = await api.patch<RecurringTransaction>(`/recurring-transaction/${id}/toggle`)
  return data
}
