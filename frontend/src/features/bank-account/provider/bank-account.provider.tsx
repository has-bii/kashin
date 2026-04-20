"use client"

import { BankAccountContext } from "../context/bank-account.context"
import type { BankAccount } from "../types"
import { useState } from "react"

export function BankAccountProvider({ children }: { children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)

  const handleDialogOpen = () => setDialogOpen(true)
  const handleDialogClose = () => setDialogOpen(false)

  const handleDeleteOpen = (account: BankAccount) => {
    setSelectedAccount(account)
    setDeleteDialogOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false)
    setTimeout(() => setSelectedAccount(null), 200)
  }

  return (
    <BankAccountContext.Provider
      value={{
        dialogOpen,
        deleteDialogOpen,
        selectedAccount,
        handleDialogOpen,
        handleDialogClose,
        handleDeleteOpen,
        handleDeleteClose,
      }}
    >
      {children}
    </BankAccountContext.Provider>
  )
}
