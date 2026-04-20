"use client"

import { useTransactionContext } from "../hooks/use-transaction-context"
import { TransactionForm } from "./transaction-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"

export default function TransactionDialogs() {
  const { dialogOpen, dialogMode, selectedTransaction, handleDialogClose } = useTransactionContext()

  const dialogTitle = dialogMode === "create" ? "Add Transaction" : "Edit Transaction"
  const dialogDescription =
    dialogMode === "create"
      ? "Record a new expense or income."
      : "Update the details of this transaction."

  return (
    <ResponsiveDialog
      title={dialogTitle}
      description={dialogDescription}
      open={dialogOpen}
      onOpenChange={handleDialogClose}
    >
      <TransactionForm prevData={selectedTransaction} onSuccess={handleDialogClose} />
    </ResponsiveDialog>
  )
}
