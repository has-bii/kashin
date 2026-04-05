import type { Transaction } from "@/features/transaction/types"

// GET /dashboard/summary response
export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  netBalance: number
}

export type DashboardSummaryParams = {
  dateFrom?: string
  dateTo?: string
}

// GET /dashboard/category-breakdown response item
export interface CategoryBreakdownItem {
  categoryId: string | null
  category:
    | {
        id: string
        name: string
        icon: string
        color: string
      }
    | undefined
  total: number
}

export type CategoryBreakdownParams = {
  dateFrom?: string
  dateTo?: string
}

// GET /dashboard/trends response item
export interface TrendsMonth {
  month: string // "YYYY-MM"
  income: number
  expense: number
}

export type TrendsParams = {
  months?: number
}

// GET /dashboard/recent reuses Transaction type
export type { Transaction }
export type RecentParams = {
  limit?: number
}
