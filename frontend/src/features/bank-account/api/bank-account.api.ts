import { api } from "@/lib/api"
import type { BankAccount } from "../types"
import type { BankAccountCreateDto, BankAccountUpdateDto } from "../validations"

export const createBankAccountApi = async (
  input: BankAccountCreateDto,
): Promise<BankAccount> => {
  const { data } = await api.post<BankAccount>("/bank-account", input)
  return data
}

export const updateBankAccountApi = async (
  id: string,
  input: BankAccountUpdateDto,
): Promise<BankAccount> => {
  const { data } = await api.put<BankAccount>(`/bank-account/${id}`, input)
  return data
}

export const deleteBankAccountApi = async (
  id: string,
  deleteTransactions: boolean,
): Promise<void> => {
  await api.delete(`/bank-account/${id}`, {
    params: { deleteTransactions },
  })
}
