"use client"

import { getBankAccountsQueryOptions } from "../api/get-bank-accounts.query"
import type { BankAccount } from "../types"
import { BankAccountCard } from "./bank-account-card"
import { useSuspenseQuery } from "@tanstack/react-query"

type Props = {
  onEdit: (account: BankAccount) => void
  onDelete: (account: BankAccount) => void
}

export default function BankAccountList({ onEdit, onDelete }: Props) {
  const { data } = useSuspenseQuery(getBankAccountsQueryOptions())

  if (data.data.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No bank accounts yet. Add one to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @2xl/main:grid-cols-3">
      {data.data.map((account) => (
        <BankAccountCard key={account.id} account={account} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
