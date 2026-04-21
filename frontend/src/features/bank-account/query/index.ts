import { getBankAccountsApi } from "../api"
import { queryOptions } from "@tanstack/react-query"

export const BANK_ACCOUNT_QUERY_KEY = "bank-accounts" as const

export const getBankAccountsQueryOptions = () =>
  queryOptions({
    queryKey: [BANK_ACCOUNT_QUERY_KEY],
    queryFn: getBankAccountsApi,
  })
