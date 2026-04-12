import { Bank } from "@/features/bank/types"

export interface BankAccount {
  id: string
  userId: string
  balance: string // Decimal comes as string from API
  bank: Bank
  createdAt: string
  updatedAt: string
}

export interface PaginatedBankAccountResponse {
  data: BankAccount[]
  total: number
  page: number
  limit: number
  totalPages: number
}
