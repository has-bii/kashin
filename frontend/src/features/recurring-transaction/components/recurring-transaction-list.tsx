"use client"

import { useRecurringTransactionContext } from "../hooks/use-recurring-transaction-context"
import { getRecurringTransactionsQueryOptions } from "../query"
import { RecurringTransactionCard } from "./recurring-transaction-card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { TransactionPagination } from "@/features/transaction/components/transaction-pagination"
import { useSuspenseQuery } from "@tanstack/react-query"
import { RepeatIcon } from "lucide-react"
import { useState } from "react"

export default function RecurringTransactionList() {
  const [page, setPage] = useState(1)
  const { handleRowClick } = useRecurringTransactionContext()

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
          <RecurringTransactionCard key={item.id} data={item} onRowClick={handleRowClick} />
        ))}
      </div>

      <TransactionPagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}
