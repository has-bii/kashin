"use client"

import { RecurringTransactionCard } from "./recurring-transaction-card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getRecurringTransactionsQueryOptions } from "@/features/recurring-transaction/api/get-recurring-transactions.query"
import type { RecurringTransaction } from "@/features/recurring-transaction/types"
import { TransactionPagination } from "@/features/transaction/components/transaction-pagination"
import { useSuspenseQuery } from "@tanstack/react-query"
import { RepeatIcon } from "lucide-react"
import { useState } from "react"

type RecurringTransactionListProps = {
  onRowClick?: (item: RecurringTransaction) => void
}

export default function RecurringTransactionList({ onRowClick }: RecurringTransactionListProps) {
  const [page, setPage] = useState(1)

  const { data } = useSuspenseQuery(getRecurringTransactionsQueryOptions({ page }))

  const items = data.data
  const totalPages = data.totalPages
  const currentPage = data.page

  if (items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RepeatIcon />
          </EmptyMedia>
          <EmptyTitle>No recurring transactions</EmptyTitle>
          <EmptyDescription>
            Set up automatic recurring transactions for bills, subscriptions, or regular income.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <RecurringTransactionCard key={item.id} data={item} onRowClick={onRowClick} />
        ))}
      </div>

      <TransactionPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  )
}
