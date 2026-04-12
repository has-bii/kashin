import { PaginatedRecurringTransactionResponse } from "../types"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"
import { queryOptions } from "@tanstack/react-query"

export type GetRecurringTransactionsParams = {
  page?: number
  limit?: number
  type?: TransactionType | null
  isActive?: boolean | null
}

const getRecurringTransactions = async (params: GetRecurringTransactionsParams) => {
  const { data } = await api.get<PaginatedRecurringTransactionResponse>("/recurring-transaction", {
    params,
  })
  return data
}

export const getRecurringTransactionsQueryKey = (params: GetRecurringTransactionsParams) => [
  "recurring-transactions",
  params,
]

export const getRecurringTransactionsQueryOptions = (params: GetRecurringTransactionsParams) =>
  queryOptions({
    queryKey: getRecurringTransactionsQueryKey(params),
    queryFn: () => getRecurringTransactions(params),
  })
