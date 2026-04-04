"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { Suspense } from "react"

import { TransactionFilterBar } from "@/features/transaction/components/TransactionFilterBar"
import { TransactionListSkeleton } from "@/features/transaction/components/TransactionListSkeleton"
import { TransactionSheet } from "@/features/transaction/components/TransactionSheet"
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

  return (
    <>
      <SiteHeader label="Transactions" />
      <MainPage>
        {/* Header */}
        <MainPageHeader>
          <MainPageTitle>Transactions</MainPageTitle>
          {/* TODO: Plan 02-04 — Add export button here */}
          <div />
          <Button onClick={handleAddTransaction} size="sm">
            <PlusIcon className="size-4" />
            Add Transaction
          </Button>
        </MainPageHeader>

        {/* Filter bar */}
        <Suspense>
          <TransactionFilterBar />
        </Suspense>

        {/* Transaction list */}
        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionList onRowClick={handleRowClick} />
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
