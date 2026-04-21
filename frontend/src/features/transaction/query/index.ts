import { GetTransactionsParams, getTransactionsApi } from "../api"
import { queryOptions } from "@tanstack/react-query"

export const TRANSACTIONS_QUERY_KEY = "transactions" as const

export const getTransactionsQueryOptions = (params: GetTransactionsParams) =>
  queryOptions({
    queryKey: [TRANSACTIONS_QUERY_KEY, params],
    queryFn: () => getTransactionsApi(params),
  })
