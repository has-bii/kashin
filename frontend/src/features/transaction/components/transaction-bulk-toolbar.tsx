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
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"

type TransactionBulkToolbarProps = {
  selectedCount: number
  isDeleting: boolean
  onDelete: () => void
}

export function TransactionBulkToolbar({
  selectedCount,
  isDeleting,
  onDelete,
}: TransactionBulkToolbarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (selectedCount === 0) return null

  return (
    <>
      <div className="bg-background flex items-center justify-between rounded-xl border px-4 py-2.5 shadow-sm">
        <span className="text-sm font-medium">{selectedCount} transactions selected</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setConfirmOpen(true)}
          disabled={isDeleting}
        >
          <Trash2Icon className="size-4" />
          Delete Selected
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} transactions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCount} transactions. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete()
                setConfirmOpen(false)
              }}
              disabled={isDeleting}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
