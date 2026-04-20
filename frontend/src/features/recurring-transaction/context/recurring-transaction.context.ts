import { RecurringTransaction } from "../types"
import { createContext } from "react"

export interface RecurringTransactionContextType {
  selectedRecurringTransaction: RecurringTransaction | null
  dialogOpen: boolean
  dialogMode: "create" | "edit"
  handleAddRecurringTransaction: () => void
  handleRowClick: (transaction: RecurringTransaction) => void
  handleDialogClose: () => void
}

export const RecurringTransactionContext = createContext<RecurringTransactionContextType | null>(
  null,
)
