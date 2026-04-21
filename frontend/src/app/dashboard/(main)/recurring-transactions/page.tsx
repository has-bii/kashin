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
import { RecurringTransactionListSkeleton } from "@/features/recurring-transaction/components/recurring-transaction-list-skeleton"
import { useRecurringTransactionContext } from "@/features/recurring-transaction/hooks/use-recurring-transaction-context"
import { RecurringTransactionProvider } from "@/features/recurring-transaction/provider/recurring-transaction.provider"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"

const RecurringTransactionList = dynamic(
  () => import("@/features/recurring-transaction/components/recurring-transaction-list"),
  {
    ssr: false,
    loading: () => <RecurringTransactionListSkeleton />,
  },
)

const RecurringTransactionDialogs = dynamic(
  () => import("@/features/recurring-transaction/components/recurring-transaction-dialogs"),
  {
    ssr: false,
  },
)

export default function RecurringTransactionsPage() {
  return (
    <RecurringTransactionProvider>
      <SiteHeader label="Recurring Transactions" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Recurring Transactions</MainPageTitle>
            <MainPageDescripton>
              Automate your recurring expenses and income. Set it up once and let Kashin handle the
              rest.
            </MainPageDescripton>
          </div>

          <AddRecurringTransactionButton />
        </MainPageHeader>

        <QueryErrorBoundary>
          <RecurringTransactionList />
        </QueryErrorBoundary>

        <RecurringTransactionDialogs />
      </MainPage>
    </RecurringTransactionProvider>
  )
}

function AddRecurringTransactionButton() {
  const { handleAddRecurringTransaction } = useRecurringTransactionContext()

  return (
    <Button
      onClick={handleAddRecurringTransaction}
      size="lg"
      className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
    >
      <PlusIcon className="size-4" />
      <span className="hidden md:block">Add Recurring</span>
    </Button>
  )
}
