"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { BankAccount } from "../types"

const formatBalance = (balance: string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(balance))

type Props = {
  account: BankAccount
  onEdit: (account: BankAccount) => void
  onDelete: (account: BankAccount) => void
}

export const BankAccountCard = ({ account, onEdit, onDelete }: Props) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{account.displayName}</span>
        <span className="text-muted-foreground text-sm">{account.bankName}</span>
        <span className="text-sm font-semibold">{formatBalance(account.balance)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(account)}
          aria-label={`Edit ${account.displayName}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(account)}
          aria-label={`Delete ${account.displayName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
