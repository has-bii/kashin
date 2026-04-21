import type { BankAccount, PaginatedBankAccountResponse } from "../types"
import type { BankAccountDto } from "../validations/schema"
import { api } from "@/lib/api"

export const getBankAccountsApi = async (): Promise<PaginatedBankAccountResponse> => {
  const { data } = await api.get<PaginatedBankAccountResponse>("/bank-account")
  return data
}

export const createBankAccountApi = async (input: BankAccountDto): Promise<BankAccount> => {
  const { data } = await api.post<BankAccount>("/bank-account", input)
  return data
}

export const deleteBankAccountApi = async (
  id: string,
  deleteTransactions: boolean,
): Promise<BankAccount> => {
  const { data } = await api.delete<BankAccount>(`/bank-account/${id}`, {
    params: { deleteTransactions },
  })
  return data
}
