import type { PaginatedBankAccountResponse } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const getBankAccounts = async (): Promise<PaginatedBankAccountResponse> => {
  const { data } = await api.get<PaginatedBankAccountResponse>("/bank-account")
  return data
}

export const getBankAccountsQueryKey = () => ["bank-accounts"]

export const getBankAccountsQueryOptions = () =>
  queryOptions({
    queryKey: getBankAccountsQueryKey(),
    queryFn: () => getBankAccounts(),
  })
