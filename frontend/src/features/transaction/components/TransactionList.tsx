"use client"

import { useQuery } from "@tanstack/react-query"
import { ReceiptIcon } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"

import { getTransactionsQueryOptions } from "@/features/transaction/api/get-transactions.query"
import { useTransactionFilters } from "@/features/transaction/hooks/use-transaction-filters"
import type { Transaction } from "@/features/transaction/types"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { authClient, type UserWithProfile } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { TransactionListSkeleton } from "./TransactionListSkeleton"
import { TransactionPagination } from "./TransactionPagination"

function formatAmount(amount: string, type: Transaction["type"], currency: string): string {
  const num = parseFloat(amount)
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(Math.abs(num))
  return type === "expense" ? `-${formatted}` : `+${formatted}`
}

type TransactionListProps = {
  onRowClick?: (transaction: Transaction) => void
  selectedIds?: Set<string>
  onToggleId?: (id: string) => void
  onToggleAll?: (ids: string[]) => void
}

export function TransactionList({
  onRowClick,
  selectedIds,
  onToggleId,
  onToggleAll,
}: TransactionListProps) {
  const { filters, setFilters, resolvedDateFrom, resolvedDateTo } = useTransactionFilters()
  const { data: session } = authClient.useSession()
  const user = session?.user as UserWithProfile | undefined
  const currency = user?.currency ?? "IDR"
  const timezone = user?.timezone ?? "Asia/Jakarta"

  const queryParams = {
    page: filters.page,
    type: filters.type ?? undefined,
    categoryId: filters.categoryId ?? undefined,
    dateFrom: resolvedDateFrom,
    dateTo: resolvedDateTo,
    search: filters.search ?? undefined,
  }

  const { data, isLoading } = useQuery(getTransactionsQueryOptions(queryParams))

  const formatDateInTz = (dateStr: string) => {
    return formatInTimeZone(dateStr, timezone, "MMM dd, yyyy")
  }

  if (isLoading) {
    return <TransactionListSkeleton />
  }

  const transactions = data?.data ?? []
  const totalPages = data?.totalPages ?? 1
  const currentPage = data?.page ?? 1

  const hasCheckboxes = !!selectedIds && !!onToggleId && !!onToggleAll

  const allSelected =
    hasCheckboxes && transactions.length > 0 && transactions.every((tx) => selectedIds.has(tx.id))
  const someSelected =
    hasCheckboxes && transactions.some((tx) => selectedIds.has(tx.id)) && !allSelected

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
      <div
        className={cn(
          "grid items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground",
          hasCheckboxes
            ? "grid-cols-[auto_1fr_1fr_1fr_auto_2fr]"
            : "grid-cols-[1fr_1fr_1fr_auto_2fr]",
        )}
      >
        {hasCheckboxes && (
          <Checkbox
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            onCheckedChange={() => onToggleAll(transactions.map((tx) => tx.id))}
            aria-label="Select all"
          />
        )}
        <span>Date</span>
        <span>Amount</span>
        <span>Category</span>
        <span>Type</span>
        <span>Note</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "grid items-center gap-4 rounded-xl px-4 py-3 text-sm transition-colors",
              hasCheckboxes
                ? "grid-cols-[auto_1fr_1fr_1fr_auto_2fr]"
                : "grid-cols-[1fr_1fr_1fr_auto_2fr]",
              onRowClick ? "hover:bg-muted/50" : "",
            )}
          >
            {/* Checkbox */}
            {hasCheckboxes && (
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.has(transaction.id)}
                  onCheckedChange={() => onToggleId(transaction.id)}
                  aria-label="Select transaction"
                />
              </div>
            )}

            {/* Date */}
            <button
              className="text-left text-muted-foreground"
              onClick={() => onRowClick?.(transaction)}
              tabIndex={-1}
            >
              {formatDateInTz(transaction.transactionDate)}
            </button>

            {/* Amount */}
            <button
              className={cn(
                "text-left font-medium tabular-nums",
                transaction.type === "income" ? "text-green-600" : "text-red-600",
              )}
              onClick={() => onRowClick?.(transaction)}
              tabIndex={-1}
            >
              {formatAmount(transaction.amount, transaction.type, currency)}
            </button>

            {/* Category */}
            <button
              className="flex items-center gap-1.5 text-left"
              onClick={() => onRowClick?.(transaction)}
              tabIndex={-1}
            >
              {transaction.category ? (
                <>
                  <span>{transaction.category.icon}</span>
                  <span className="truncate">{transaction.category.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Uncategorized</span>
              )}
            </button>

            {/* Type badge */}
            <button onClick={() => onRowClick?.(transaction)} tabIndex={-1}>
              <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                {transaction.type === "income" ? "Income" : "Expense"}
              </Badge>
            </button>

            {/* Note */}
            <button
              className="truncate text-left text-muted-foreground"
              onClick={() => onRowClick?.(transaction)}
              tabIndex={-1}
            >
              {transaction.description
                ? transaction.description.length > 50
                  ? `${transaction.description.slice(0, 50)}…`
                  : transaction.description
                : "—"}
            </button>
          </div>
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
