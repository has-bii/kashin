import { TransactionType } from "@/types/enums"

export interface Transaction {
  id: string
  userId: string
  categoryId: string | null
  bankAccountId: string | null
  type: TransactionType
  amount: string
  currency: string
  transactionDate: string
  description: string | null
  notes: string | null
  source: string | null
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    type: TransactionType
    icon: string
    color: string
  } | null
}

export interface PaginatedTransactionResponse {
  data: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}
