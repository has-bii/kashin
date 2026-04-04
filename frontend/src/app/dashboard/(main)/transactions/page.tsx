"use client"

import { useState } from "react"
import { DownloadIcon, Loader2Icon, PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { toast } from "sonner"

import { exportTransactionsCsv } from "@/features/transaction/api/export-transactions"
import { TransactionBulkToolbar } from "@/features/transaction/components/TransactionBulkToolbar"
import { TransactionFilterBar } from "@/features/transaction/components/TransactionFilterBar"
import { TransactionListSkeleton } from "@/features/transaction/components/TransactionListSkeleton"
import { TransactionSheet } from "@/features/transaction/components/TransactionSheet"
import { useBulkDelete } from "@/features/transaction/hooks/use-bulk-delete"
import { useTransactionFilters } from "@/features/transaction/hooks/use-transaction-filters"
import type { Transaction } from "@/features/transaction/types"
import { Button } from "@/components/ui/button"
import { MainPage, MainPageHeader, MainPageTitle } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"

const TransactionList = dynamic(
  () => import("@/features/transaction/components/transaction-list"),
  {
    ssr: false,
    loading: () => <TransactionListSkeleton />,
  },
)

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const { filters, resolvedDateFrom, resolvedDateTo } = useTransactionFilters()
  const { selectedIds, selectedCount, toggleId, toggleAll, clearSelection, isSelected, deleteSelected, isDeleting } = useBulkDelete()

  // sheetMode derived: if selectedTransaction is set → "edit"; otherwise → "create"
  const sheetMode = selectedTransaction ? "edit" : "create"

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setSheetOpen(true)
  }

  const handleAddTransaction = () => {
    setSelectedTransaction(null)
    setSheetOpen(true)
  }

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open)
    // Reset selectedTransaction after close to avoid stale state (Pitfall 3)
    if (!open) {
      setTimeout(() => setSelectedTransaction(null), 200)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportTransactionsCsv({
        type: filters.type ?? undefined,
        categoryId: filters.categoryId ?? undefined,
        dateFrom: resolvedDateFrom,
        dateTo: resolvedDateTo,
        search: filters.search ?? undefined,
      })
    } catch {
      toast.error("Failed to export transactions")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <SiteHeader label="Transactions" />
      <MainPage>
        {/* Header */}
        <MainPageHeader>
          <MainPageTitle>Transactions</MainPageTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <DownloadIcon className="size-4" />
              )}
              Export
            </Button>
            <Button onClick={handleAddTransaction} size="sm">
              <PlusIcon className="size-4" />
              Add Transaction
            </Button>
          </div>
        </MainPageHeader>

        {/* Filter bar */}
        <Suspense>
          <TransactionFilterBar />
        </Suspense>

        {/* Bulk toolbar — shown when rows are selected */}
        {selectedCount > 0 && (
          <TransactionBulkToolbar
            selectedCount={selectedCount}
            isDeleting={isDeleting}
            onDelete={deleteSelected}
          />
        )}

        {/* Transaction list */}
        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionList
            onRowClick={handleRowClick}
            selectedIds={selectedIds}
            onToggleId={toggleId}
            onToggleAll={toggleAll}
          />
        </Suspense>

        {/* Transaction sheet — create or edit mode */}
        {sheetMode === "edit" && selectedTransaction ? (
          <TransactionSheet
            mode="edit"
            open={sheetOpen}
            onOpenChange={handleSheetClose}
            data={selectedTransaction}
          />
        ) : (
          <TransactionSheet mode="create" open={sheetOpen} onOpenChange={handleSheetClose} />
        )}
      </MainPage>
    </>
  )
}
