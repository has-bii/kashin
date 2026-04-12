"use client"

import { QueryErrorBoundary } from "@/components/query-error-boundary"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import { Button } from "@/components/ui/button"
import BankAccountDelete from "@/features/bank-account/components/bank-account-delete"
import { BankAccountForm } from "@/features/bank-account/components/bank-account-form"
import BankAccountSkeleton from "@/features/bank-account/components/bank-account-skeleton"
import type { BankAccount } from "@/features/bank-account/types"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"

const BankAccountList = dynamic(
  () => import("@/features/bank-account/components/bank-account-list"),
  {
    ssr: false,
    loading: () => <BankAccountSkeleton />,
  },
)

export default function BankAccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleAddAccount = () => setAddDialogOpen(true)

  const handleDeleteAccount = (account: BankAccount) => {
    setSelectedAccount(account)
    setDeleteDialogOpen(true)
  }

  const handleAddDialogClose = () => setAddDialogOpen(false)

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setTimeout(() => setSelectedAccount(null), 200)
  }

  return (
    <>
      <SiteHeader label="Bank Accounts" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Bank Accounts</MainPageTitle>
            <MainPageDescripton>
              Manage your bank accounts and track your balances across all your accounts.
            </MainPageDescripton>
          </div>

          <Button
            onClick={handleAddAccount}
            size="xl"
            className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
          >
            <PlusIcon className="size-4" />
            <span className="hidden md:block">Add Account</span>
          </Button>
        </MainPageHeader>

        <QueryErrorBoundary>
          <BankAccountList onDelete={handleDeleteAccount} />
        </QueryErrorBoundary>

        <ResponsiveDialog
          title="Add Account"
          description="Add a new bank account to track your balance."
          open={addDialogOpen}
          onOpenChange={handleAddDialogClose}
        >
          <BankAccountForm mode="create" onSuccess={handleAddDialogClose} />
        </ResponsiveDialog>

        <ResponsiveDialog
          title={`Delete ${selectedAccount?.bank.name} account?`}
          description="This will permanently delete the account. What should happen to linked transactions?"
          open={deleteDialogOpen}
          onOpenChange={handleDeleteDialogClose}
        >
          <BankAccountDelete data={selectedAccount} close={handleDeleteDialogClose} />
        </ResponsiveDialog>
      </MainPage>
    </>
  )
}
