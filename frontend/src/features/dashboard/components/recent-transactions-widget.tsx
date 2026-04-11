"use client"

import { getDashboardRecentQueryOptions } from "../api/get-dashboard-recent.query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAmount } from "@/utils/format-amount"
import { formatDate } from "@/utils/format-date"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function RecentTransactionsWidget() {
  const { data } = useSuspenseQuery(getDashboardRecentQueryOptions({ limit: 10 }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your last 10 transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-base font-medium">No transactions yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Add your first transaction to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-border divide-y">
            {data.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-xl" aria-hidden="true">
                    {tx.category?.icon ?? "💸"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {tx.category?.name ?? "Uncategorized"}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
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
                  <p className="text-muted-foreground text-xs">
                    {formatDate(tx.transactionDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
