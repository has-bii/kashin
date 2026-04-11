"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useDeleteBankAccount } from "../hooks/use-delete-bank-account"
import type { BankAccount } from "../types"

type Props = {
  account: BankAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const DeleteBankAccountDialog = ({
  account,
  open,
  onOpenChange,
  onSuccess,
}: Props) => {
  const [deleteTransactions, setDeleteTransactions] = useState(false)
  const { mutateAsync, isPending } = useDeleteBankAccount({ onSuccess })

  const handleConfirm = async () => {
    if (!account) return
    await mutateAsync({ id: account.id, deleteTransactions })
    onOpenChange(false)
    setDeleteTransactions(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete bank account</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the account &quot;{account?.displayName}&quot;. What
            should happen to linked transactions?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-2 py-2">
          <Checkbox
            id="delete-transactions"
            checked={deleteTransactions}
            onCheckedChange={(checked) => setDeleteTransactions(checked === true)}
          />
          <Label htmlFor="delete-transactions">Also delete all linked transactions</Label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
