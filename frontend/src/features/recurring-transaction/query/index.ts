import { GetRecurringTransactionsParams, getRecurringTransactionsApi } from "../api"
import { queryOptions } from "@tanstack/react-query"

export const RECURRING_TRANSACTIONS_QUERY_KEY = "recurring-transactions" as const

export const getRecurringTransactionsQueryOptions = (params: GetRecurringTransactionsParams) =>
  queryOptions({
    queryKey: [RECURRING_TRANSACTIONS_QUERY_KEY, params],
    queryFn: () => getRecurringTransactionsApi(params),
  })
