import { Transaction } from "../types"
import { createContext } from "react"

export interface TransactionContextType {
  selectedTransaction: Transaction | null
  dialogOpen: boolean
  dialogMode: "create" | "edit"
  handleAddTransaction: () => void
  handleRowClick: (transaction: Transaction) => void
  handleDialogClose: () => void
  // Bulk delete selection
  selectedIds: Set<string>
  selectedCount: number
  toggleId: (id: string) => void
  toggleAll: (ids: string[]) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
  deleteSelected: () => void
  isDeleting: boolean
}

export const TransactionContext = createContext<TransactionContextType | null>(null)
