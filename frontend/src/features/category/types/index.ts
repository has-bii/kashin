import { TransactionType } from "@/types/enums"

export interface Category {
  id: string
  userId: string
  name: string
  type: TransactionType
  icon: string
  color: string
  createdAt: string
  updatedAt: string
}
