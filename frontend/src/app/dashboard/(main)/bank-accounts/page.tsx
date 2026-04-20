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
import BankAccountSkeleton from "@/features/bank-account/components/bank-account-skeleton"
import { useBankAccountContext } from "@/features/bank-account/hooks/use-bank-account-context"
import { BankAccountProvider } from "@/features/bank-account/provider/bank-account.provider"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"

const BankAccountList = dynamic(
  () => import("@/features/bank-account/components/bank-account-list"),
  {
    ssr: false,
    loading: () => <BankAccountSkeleton />,
  },
)

const BankAccountDialogs = dynamic(
  () => import("@/features/bank-account/components/bank-account-dialogs"),
  { ssr: false },
)

function AddAccountButton() {
  const { handleDialogOpen } = useBankAccountContext()
  return (
    <Button
      onClick={handleDialogOpen}
      size="lg"
      className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
    >
      <PlusIcon className="size-4" />
      <span className="hidden md:block">Add Account</span>
    </Button>
  )
}

export default function BankAccountsPage() {
  return (
    <BankAccountProvider>
      <SiteHeader label="Bank Accounts" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Bank Accounts</MainPageTitle>
            <MainPageDescripton>
              Manage your bank accounts and track balances across all accounts.
            </MainPageDescripton>
          </div>
          <AddAccountButton />
        </MainPageHeader>

        <QueryErrorBoundary>
          <BankAccountList />
        </QueryErrorBoundary>

        <BankAccountDialogs />
      </MainPage>
    </BankAccountProvider>
  )
}
