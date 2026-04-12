export type BankName = "bca" | "jago" | "cash"

export interface BankAccount {
  id: string
  userId: string
  bankName: BankName
  balance: string // Decimal comes as string from API
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
