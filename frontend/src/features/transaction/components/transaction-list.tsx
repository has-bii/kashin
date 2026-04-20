import { TransactionCard } from "./transaction-card"
import { TransactionPagination } from "./transaction-pagination"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { useTransactionContext } from "@/features/transaction/hooks/use-transaction-context"
import { useTransactionFilters } from "@/features/transaction/hooks/use-transaction-filters"
import { getTransactionsQueryOptions } from "@/features/transaction/query"
import type { Transaction } from "@/features/transaction/types"
import { formatDate } from "@/utils/format-date"
import { useSuspenseQuery } from "@tanstack/react-query"
import { formatISO, isToday } from "date-fns"
import { ReceiptIcon } from "lucide-react"

export default function TransactionList() {
  const { handleRowClick: onRowClick } = useTransactionContext()
  const { filters, setFilters } = useTransactionFilters()

  const queryParams = {
    page: filters.page,
    type: filters.type ?? undefined,
    categoryId: filters.categoryId ?? undefined,
    dateFrom: formatISO(filters.dateFrom, { representation: "date" }),
    dateTo: formatISO(filters.dateTo, { representation: "date" }),
    search: filters.search ?? undefined,
  }

  const { data } = useSuspenseQuery(getTransactionsQueryOptions(queryParams))

  const transactions = data.data
  const totalPages = data.totalPages
  const currentPage = data.page

  if (transactions.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ReceiptIcon />
          </EmptyMedia>
          <EmptyTitle>Belum ada transaksi</EmptyTitle>
          <EmptyDescription>Coba sesuaikan filter atau tambah transaksi baru.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // Group by date
  const groupTransactionsByDate = transactions.reduce<Record<string, Transaction[]>>(
    (groups, transaction) => {
      // Extract the date part (YYYY-MM-DD) from the transactionDate string
      // This handles both "2024-05-20" and "2024-05-20T14:30:00Z"
      const dateKey = transaction.transactionDate.split("T")[0]

      // Initialize the group if it doesn't exist
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      // Add the transaction to the corresponding group
      groups[dateKey].push(transaction)

      return groups
    },
    {},
  )

  return (
    <>
      <div className="flex flex-col gap-8">
        {Object.entries(groupTransactionsByDate).map(([date, transactions]) => (
          <div className="space-y-4" key={date}>
            {/* Date */}
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground shrink-0 text-sm font-medium uppercase">
                {isToday(date) ? "Hari Ini" : formatDate(date, "EEEE, MMM d")}
              </div>
              <Separator orientation="horizontal" className="w-auto flex-1" />
            </div>

            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} data={transaction} onRowClick={onRowClick} />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <TransactionPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </>
  )
}
