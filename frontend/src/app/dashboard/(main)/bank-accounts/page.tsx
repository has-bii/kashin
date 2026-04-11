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
import { BankAccountForm } from "@/features/bank-account/components/bank-account-form"
import { DeleteBankAccountDialog } from "@/features/bank-account/components/delete-bank-account-dialog"
import type { BankAccount } from "@/features/bank-account/types"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"

const BankAccountList = dynamic(
  () => import("@/features/bank-account/components/bank-account-list"),
  { ssr: false },
)

export default function BankAccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleAddAccount = () => {
    setSelectedAccount(null)
    setDialogOpen(true)
  }

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account)
    setDialogOpen(true)
  }

  const handleDeleteAccount = (account: BankAccount) => {
    setSelectedAccount(account)
    setDeleteDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setTimeout(() => setSelectedAccount(null), 200)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setTimeout(() => setSelectedAccount(null), 200)
  }

  const dialogTitle = selectedAccount ? "Edit Account" : "Add Account"
  const dialogDescription = selectedAccount
    ? "Update your bank account details."
    : "Add a new bank account to track your balance."

  return (
    <>
      <SiteHeader label="Bank Accounts" />
      <MainPage>
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

        <BankAccountList onEdit={handleEditAccount} onDelete={handleDeleteAccount} />

        <ResponsiveDialog
          title={dialogTitle}
          description={dialogDescription}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
        >
          {selectedAccount ? (
            <BankAccountForm mode="edit" data={selectedAccount} onSuccess={handleDialogClose} />
          ) : (
            <BankAccountForm mode="create" onSuccess={handleDialogClose} />
          )}
        </ResponsiveDialog>

        <DeleteBankAccountDialog
          account={selectedAccount}
          open={deleteDialogOpen}
          onOpenChange={handleDeleteDialogClose}
          onSuccess={handleDeleteDialogClose}
        />
      </MainPage>
    </>
  )
}
