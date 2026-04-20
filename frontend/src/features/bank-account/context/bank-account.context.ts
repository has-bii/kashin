import type { BankAccount } from "../types"
import { createContext } from "react"

export interface BankAccountContextType {
  dialogOpen: boolean
  deleteDialogOpen: boolean
  selectedAccount: BankAccount | null
  handleDialogOpen: () => void
  handleDialogClose: () => void
  handleDeleteOpen: (account: BankAccount) => void
  handleDeleteClose: () => void
}

export const BankAccountContext = createContext<BankAccountContextType | null>(null)
