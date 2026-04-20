"use client"

import { useDeleteBankAccountMutation } from "../mutations"
import type { BankAccount } from "../types"
import { ResponsiveDialogFooter } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type Props = {
  close: () => void
  data: BankAccount | null
}

export default function BankAccountDelete({ close, data }: Props) {
  const [deleteTransactions, setDeleteTransactions] = useState(false)
  const deleteMutation = useDeleteBankAccountMutation()

  const handleConfirm = () => {
    if (!data) return
    deleteMutation.mutate({ id: data.id, deleteTransactions }, { onSuccess: close })
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 md:px-0">
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
