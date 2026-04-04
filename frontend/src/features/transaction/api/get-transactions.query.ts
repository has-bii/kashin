import { PaginatedTransactionResponse } from "../types"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"
import { queryOptions } from "@tanstack/react-query"

export type GetTransactionsParams = {
  page?: number
  limit?: number
  type?: TransactionType | null
  categoryId?: string | null
  dateFrom?: string | null
  dateTo?: string | null
  search?: string | null
}

const getTransactions = async (params: GetTransactionsParams) => {
  const { data } = await api.get<PaginatedTransactionResponse>("/transaction", { params })
  return data
}

export const getTransactionsQueryKey = (params: GetTransactionsParams) => ["transactions", params]

export const getTransactionsQueryOptions = (params: GetTransactionsParams) => {
  return queryOptions({
    queryKey: getTransactionsQueryKey(params),
    queryFn: () => getTransactions(params),
  })
}
