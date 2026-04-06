"use client"

import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import { Button } from "@/components/ui/button"
import { TransactionListSkeleton } from "@/features/transaction/components/transaciton-list-skeleton"
import { TransactionSheet } from "@/features/transaction/components/transaction-sheet"
import type { Transaction } from "@/features/transaction/types"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"

const TransactionList = dynamic(
  () => import("@/features/transaction/components/transaction-list"),
  {
    ssr: false,
    loading: () => <TransactionListSkeleton />,
  },
)

const TransactionFilterBar = dynamic(
  () => import("@/features/transaction/components/transaction-filter-bar"),
  {
    ssr: false,
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
          <div className="space-y-2">
            <MainPageTitle>Transactions</MainPageTitle>
            <MainPageDescripton>
              Review and curate your financial history. Every transaction is a step toward your
              long-term prosperity and sustainable growth.
            </MainPageDescripton>
          </div>

          <Button
            onClick={handleAddTransaction}
            size="xl"
            className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
          >
            <PlusIcon className="size-4" />
            <span className="hidden md:block">Add Transaction</span>
          </Button>
        </MainPageHeader>

        {/* Filter bar */}
        <TransactionFilterBar />

        {/* Transaction list */}
        <TransactionList onRowClick={handleRowClick} />

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
