"use client"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import { Button } from "@/components/ui/button"
import { TransactionListSkeleton } from "@/features/transaction/components/transaciton-list-skeleton"
import { TransactionForm } from "@/features/transaction/components/transaction-form"
import type { Transaction } from "@/features/transaction/types"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"

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
  const [dialogOpen, setDialogOpen] = useState(false)

  // dialogMode derived: if selectedTransaction is set → "edit"; otherwise → "create"
  const dialogMode = useMemo(() => (selectedTransaction ? "edit" : "create"), [selectedTransaction])

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDialogOpen(true)
  }

  const handleAddTransaction = () => {
    setSelectedTransaction(null)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    // Reset selectedTransaction after close to avoid stale state (Pitfall 3)
    setTimeout(() => setSelectedTransaction(null), 200)
  }

  // Dialog Info
  const dialogInfo = useMemo(() => {
    return {
      title: dialogMode === "create" ? "Add Transaction" : "Edit Transaction",
      description:
        dialogMode === "create"
          ? "Record a new expense or income."
          : "Update the details of this transaction.",
    }
  }, [dialogMode])

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

        {/* Transaction Responsive Dialog - Create or update mode */}
        <ResponsiveDialog
          title={dialogInfo.title}
          description={dialogInfo.description}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
        >
          {dialogMode === "create" ? (
            <TransactionForm mode="create" onSuccess={handleDialogClose} />
          ) : (
            <TransactionForm
              mode="edit"
              data={selectedTransaction!}
              onSuccess={handleDialogClose}
            />
          )}
        </ResponsiveDialog>
      </MainPage>
    </>
  )
}
