"use client"

import { format } from "date-fns"
import { ReceiptIcon } from "lucide-react"

import { getTransactionsQueryOptions } from "@/features/transaction/api/get-transactions.query"
import { useTransactionFilters } from "@/features/transaction/hooks/use-transaction-filters"
import type { Transaction } from "@/features/transaction/types"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

import { TransactionListSkeleton } from "./TransactionListSkeleton"
import { TransactionPagination } from "./TransactionPagination"

type TransactionListProps = {
  onRowClick?: (transaction: Transaction) => void
}

function formatAmount(amount: string, type: Transaction["type"]): string {
  const num = parseFloat(amount)
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(num))
  return type === "expense" ? `-${formatted}` : `+${formatted}`
}

export function TransactionList({ onRowClick }: TransactionListProps) {
  const { filters, setFilters, resolvedDateFrom, resolvedDateTo } = useTransactionFilters()

  const queryParams = {
    page: filters.page,
    type: filters.type ?? undefined,
    categoryId: filters.categoryId ?? undefined,
    dateFrom: resolvedDateFrom,
    dateTo: resolvedDateTo,
    search: filters.search ?? undefined,
  }

  const { data, isLoading } = useQuery(getTransactionsQueryOptions(queryParams))

  if (isLoading) {
    return <TransactionListSkeleton />
  }

  const transactions = data?.data ?? []
  const totalPages = data?.totalPages ?? 1
  const currentPage = data?.page ?? 1

  if (transactions.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ReceiptIcon />
          </EmptyMedia>
          <EmptyTitle>No transactions found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters or add a new transaction.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_1fr_1fr_auto_2fr] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span>Date</span>
        <span>Amount</span>
        <span>Category</span>
        <span>Type</span>
        <span>Note</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1">
        {transactions.map((transaction) => (
          <button
            key={transaction.id}
            onClick={() => onRowClick?.(transaction)}
            className={cn(
              "grid grid-cols-[1fr_1fr_1fr_auto_2fr] items-center gap-4 rounded-xl px-4 py-3 text-sm transition-colors text-left",
              onRowClick
                ? "hover:bg-muted/50 cursor-pointer"
                : "cursor-default",
            )}
          >
            {/* Date */}
            <span className="text-muted-foreground">
              {format(new Date(transaction.transactionDate), "MMM dd, yyyy")}
            </span>

            {/* Amount */}
            <span
              className={cn(
                "font-medium tabular-nums",
                transaction.type === "income" ? "text-green-600" : "text-red-600",
              )}
            >
              {formatAmount(transaction.amount, transaction.type)}
            </span>

            {/* Category */}
            <span className="flex items-center gap-1.5">
              {transaction.category ? (
                <>
                  <span>{transaction.category.icon}</span>
                  <span className="truncate">{transaction.category.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Uncategorized</span>
              )}
            </span>

            {/* Type badge */}
            <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
              {transaction.type === "income" ? "Income" : "Expense"}
            </Badge>

            {/* Note */}
            <span className="truncate text-muted-foreground">
              {transaction.description
                ? transaction.description.length > 50
                  ? `${transaction.description.slice(0, 50)}…`
                  : transaction.description
                : "—"}
            </span>
          </button>
        ))}
      </div>

      {/* Pagination */}
      <TransactionPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  )
}
