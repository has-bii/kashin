"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { formatInTimeZone } from "date-fns-tz"

import { getDashboardRecentTransactionsQueryOptions } from "../api/get-dashboard-recent.query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient, type UserWithProfile } from "@/lib/auth-client"
import { formatCurrency } from "@/lib/locale-utils"

export function RecentTransactionsWidget() {
  const { data } = useSuspenseQuery(getDashboardRecentTransactionsQueryOptions({ limit: 10 }))

  const session = authClient.useSession()
  const user = session?.data?.user as UserWithProfile | undefined
  const currency = user?.currency ?? "IDR"
  const timezone = user?.timezone ?? "Asia/Jakarta"

  const formatAmount = (value: string, type: string) => {
    const num = parseFloat(value)
    const formatted = formatCurrency(num, currency)
    return type === "income" ? `+${formatted}` : `-${formatted}`
  }

  const formatDate = (dateStr: string) => {
    return formatInTimeZone(dateStr, timezone, "MMM dd, yyyy")
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your last 10 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-base font-medium">No transactions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first transaction to get started.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl" aria-hidden="true">
                      {tx.category?.icon ?? "💸"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {tx.category?.name ?? "Uncategorized"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {tx.description ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-medium tabular-nums ${
                        tx.type === "income" ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {formatAmount(tx.amount, tx.type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.transactionDate)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
