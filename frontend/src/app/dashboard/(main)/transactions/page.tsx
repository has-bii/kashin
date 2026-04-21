"use client"

import { QueryErrorBoundary } from "@/components/query-error-boundary"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import { Button } from "@/components/ui/button"
import { TransactionListSkeleton } from "@/features/transaction/components/transaction-list-skeleton"
import { useTransactionContext } from "@/features/transaction/hooks/use-transaction-context"
import { TransactionProvider } from "@/features/transaction/provider/transaction.provider"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"

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

const TransactionDialogs = dynamic(
  () => import("@/features/transaction/components/transaction-dialogs"),
  {
    ssr: false,
  },
)

export default function TransactionsPageInner() {
  return (
    <TransactionProvider>
      <SiteHeader label="Transactions" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Transactions</MainPageTitle>
            <MainPageDescripton>
              Review and manage your financial history. Every transaction is a real step toward
              long-term financial wellbeing.
            </MainPageDescripton>
          </div>

          <AddTransactionButton />
        </MainPageHeader>

        <QueryErrorBoundary>
          <TransactionFilterBar />
        </QueryErrorBoundary>

        <QueryErrorBoundary>
          <TransactionList />
        </QueryErrorBoundary>

        <TransactionDialogs />
      </MainPage>
    </TransactionProvider>
  )
}

function AddTransactionButton() {
  const { handleAddTransaction } = useTransactionContext()

  return (
    <Button
      onClick={handleAddTransaction}
      size="lg"
      className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
    >
      <PlusIcon className="size-4" />
      <span className="hidden md:block">Add Transaction</span>
    </Button>
  )
}
