"use client"

import { Transaction } from "../types"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TransactionForm } from "./TransactionForm"

type Props =
  | { mode: "create"; open: boolean; onOpenChange: (v: boolean) => void }
  | { mode: "edit"; open: boolean; onOpenChange: (v: boolean) => void; data: Transaction }

export function TransactionSheet(props: Props) {
  const { mode, open, onOpenChange } = props

  const handleSuccess = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>{mode === "create" ? "Add Transaction" : "Edit Transaction"}</SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Record a new expense or income."
              : "Update the details of this transaction."}
          </SheetDescription>
        </SheetHeader>

        {mode === "create" ? (
          <TransactionForm mode="create" onSuccess={handleSuccess} />
        ) : (
          <TransactionForm mode="edit" data={props.data} onSuccess={handleSuccess} />
        )}
      </SheetContent>
    </Sheet>
  )
}
