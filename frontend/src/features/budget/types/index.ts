export type BudgetPeriod = 'daily' | 'weekly' | 'monthly'
export type BudgetAlertStatus = 'ok' | 'warning' | 'exceeded'

export interface Budget {
  id: string
  userId: string
  categoryId: string
  amount: number
  period: BudgetPeriod
  alertThreshold: number
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    icon: string
    color: string
  }
  periodRange: { from: string; to: string }
  spent: number
  remaining: number
  alertStatus: BudgetAlertStatus
}
