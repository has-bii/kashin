import { TransactionType } from "@/types/enums"

export type RecurringFrequency = "weekly" | "biweekly" | "monthly" | "yearly"

export interface RecurringTransaction {
  id: string
  userId: string
  categoryId: string | null
  type: TransactionType
  amount: string
  currency: string
  description: string
  frequency: RecurringFrequency
  nextDueDate: string
  lastGeneratedDate: string | null
  isActive: boolean
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

export interface PaginatedRecurringTransactionResponse {
  data: RecurringTransaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}
