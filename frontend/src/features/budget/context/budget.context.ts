import { Budget } from "../types"
import { createContext } from "react"

export interface BudgetContextType {
  selectedBudget: Budget | null
  dialogOpen: boolean
  dialogMode: "create" | "update"
  handleAddBudget: () => void
  handleUpdateBudget: (budget: Budget) => void
  handleDialogClose: () => void
  dialogDeleteOpen: boolean
  selectedDeleteBudget: Budget | null
  handleDeleteBudget: (budget: Budget) => void
  handleDeleteDialogClose: () => void
}

export const BudgetContext = createContext<BudgetContextType | null>(null)
