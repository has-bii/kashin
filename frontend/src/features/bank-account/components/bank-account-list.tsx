"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { getBankAccountsQueryOptions } from "../api/get-bank-accounts.query"
import type { BankAccount } from "../types"
import { BankAccountCard } from "./bank-account-card"

type Props = {
  onEdit: (account: BankAccount) => void
  onDelete: (account: BankAccount) => void
}

export const BankAccountList = ({ onEdit, onDelete }: Props) => {
  const { data } = useSuspenseQuery(getBankAccountsQueryOptions())

  if (data.data.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No bank accounts yet. Add one to get started.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {data.data.map((account) => (
        <BankAccountCard
          key={account.id}
          account={account}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
