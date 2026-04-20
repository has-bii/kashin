"use client"

import { TransactionContext, TransactionContextType } from "../context/transaction.context"
import { useBulkDeleteTransactionsMutation } from "../mutations"
import { Transaction } from "../types"
import React from "react"

type Props = {
  children: React.ReactNode
}

export function TransactionProvider({ children }: Props) {
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const dialogMode = selectedTransaction ? "edit" : "create"

  const handleAddTransaction = () => {
    setSelectedTransaction(null)
    setDialogOpen(true)
  }

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setTimeout(() => setSelectedTransaction(null), 200)
  }

  /* ----------------------------- Bulk delete ----------------------------- */
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const bulkDeleteMutation = useBulkDeleteTransactionsMutation()

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = (ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id))
      const next = new Set(prev)
      if (allSelected) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const isSelected = (id: string) => selectedIds.has(id)

  const deleteSelected = () => {
    if (selectedIds.size === 0) return
    bulkDeleteMutation.mutate([...selectedIds], { onSuccess: clearSelection })
  }

  const value: TransactionContextType = {
    selectedTransaction,
    dialogOpen,
    dialogMode,
    handleAddTransaction,
    handleRowClick,
    handleDialogClose,
    selectedIds,
    selectedCount: selectedIds.size,
    toggleId,
    toggleAll,
    clearSelection,
    isSelected,
    deleteSelected,
    isDeleting: bulkDeleteMutation.isPending,
  }

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}
