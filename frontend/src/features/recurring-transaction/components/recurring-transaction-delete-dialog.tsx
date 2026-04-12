"use client"

import { useDeleteRecurringTransaction } from "../hooks/use-delete-recurring-transaction"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"

type Props = {
  recurringTransactionId: string
  onSuccess?: () => void
}

export function RecurringTransactionDeleteDialog({ recurringTransactionId, onSuccess }: Props) {
  const { mutateAsync, isPending } = useDeleteRecurringTransaction({ onSuccess })

  const handleDelete = async () => {
    await mutateAsync(recurringTransactionId)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" className="w-full" type="button">
          Delete
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Recurring Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This recurring transaction will be permanently removed and
            no future transactions will be generated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
