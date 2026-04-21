"use client"

import { useRecurringTransactionContext } from "../hooks/use-recurring-transaction-context"
import { RecurringTransactionDeleteDialog } from "./recurring-transaction-delete-dialog"
import { RecurringTransactionForm } from "./recurring-transaction-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"

export default function RecurringTransactionDialogs() {
  const { dialogOpen, dialogMode, selectedRecurringTransaction, handleDialogClose } =
    useRecurringTransactionContext()

  const dialogTitle =
    dialogMode === "create" ? "Add Recurring Transaction" : "Edit Recurring Transaction"
  const dialogDescription =
    dialogMode === "create"
      ? "Set up a new expense or income that repeats automatically."
      : "Update the details of this recurring transaction."

  return (
    <>
      <ResponsiveDialog
        title={dialogTitle}
        description={dialogDescription}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      >
        <RecurringTransactionForm
          prevData={selectedRecurringTransaction}
          onSuccess={handleDialogClose}
        />
      </ResponsiveDialog>

      {dialogMode === "edit" && selectedRecurringTransaction && (
        <RecurringTransactionDeleteDialog
          recurringTransactionId={selectedRecurringTransaction.id}
          onSuccess={handleDialogClose}
        />
      )}
    </>
  )
}
