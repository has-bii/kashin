"use client"

import {
  RecurringTransactionContext,
  RecurringTransactionContextType,
} from "../context/recurring-transaction.context"
import { RecurringTransaction } from "../types"
import React from "react"

type Props = {
  children: React.ReactNode
}

export function RecurringTransactionProvider({ children }: Props) {
  const [selectedRecurringTransaction, setSelectedRecurringTransaction] =
    React.useState<RecurringTransaction | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const dialogMode = selectedRecurringTransaction ? "edit" : "create"

  const handleAddRecurringTransaction = () => {
    setSelectedRecurringTransaction(null)
    setDialogOpen(true)
  }

  const handleRowClick = (transaction: RecurringTransaction) => {
    setSelectedRecurringTransaction(transaction)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setTimeout(() => setSelectedRecurringTransaction(null), 200)
  }

  const value: RecurringTransactionContextType = {
    selectedRecurringTransaction,
    dialogOpen,
    dialogMode,
    handleAddRecurringTransaction,
    handleRowClick,
    handleDialogClose,
  }

  return (
    <RecurringTransactionContext.Provider value={value}>
      {children}
    </RecurringTransactionContext.Provider>
  )
}
