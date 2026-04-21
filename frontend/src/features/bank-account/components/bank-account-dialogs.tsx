"use client"

import { useBankAccountContext } from "../hooks/use-bank-account-context"
import BankAccountDelete from "./bank-account-delete"
import { BankAccountForm } from "./bank-account-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"

export default function BankAccountDialogs() {
  const { dialogOpen, deleteDialogOpen, selectedAccount, handleDialogClose, handleDeleteClose } =
    useBankAccountContext()

  return (
    <>
      <ResponsiveDialog
        title="Add Account"
        description="Add a new bank account to track your balance."
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      >
        <BankAccountForm onSuccess={handleDialogClose} />
      </ResponsiveDialog>

      <ResponsiveDialog
        title={selectedAccount ? `Delete ${selectedAccount.bank.name}?` : "Delete Account?"}
        description="This account will be permanently deleted. Choose what to do with linked transactions."
        open={deleteDialogOpen}
        onOpenChange={handleDeleteClose}
      >
        <BankAccountDelete data={selectedAccount} close={handleDeleteClose} />
      </ResponsiveDialog>
    </>
  )
}
