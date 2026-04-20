"use client"

import { getBankAccountsQueryOptions } from "../query"
import { BankAccountCard } from "./bank-account-card"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function BankAccountList() {
  const { data } = useSuspenseQuery(getBankAccountsQueryOptions())

  if (data.data.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No bank accounts yet. Add one to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @3xl/main:grid-cols-3">
      {data.data.map((account) => (
        <BankAccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
