"use client"

import { ResponsiveDialogFooter } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useDeleteBankAccount } from "../hooks/use-delete-bank-account"
import type { BankAccount } from "../types"

type Props = {
  close: () => void
  data: BankAccount | null
}

export default function BankAccountDelete({ close, data }: Props) {
  const [deleteTransactions, setDeleteTransactions] = useState(false)
  const deleteMutation = useDeleteBankAccount({ onSuccess: close })

  const handleConfirm = () => {
    if (!data) return
    deleteMutation.mutate({ id: data.id, deleteTransactions })
  }

  return (
    <>
      <div className="flex items-center gap-2 py-2">
        <Checkbox
          id="delete-transactions"
          checked={deleteTransactions}
          onCheckedChange={(checked) => setDeleteTransactions(checked === true)}
        />
        <Label htmlFor="delete-transactions">Also delete all linked transactions</Label>
      </div>

      <ResponsiveDialogFooter>
        <Button variant="secondary" size="lg" disabled={deleteMutation.isPending} onClick={close}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="lg"
          disabled={deleteMutation.isPending}
          onClick={handleConfirm}
        >
          Delete
        </Button>
      </ResponsiveDialogFooter>
    </>
  )
}
