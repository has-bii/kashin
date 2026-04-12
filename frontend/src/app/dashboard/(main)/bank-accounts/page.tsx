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
      <SiteHeader label="Rekening Bank" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Rekening Bank</MainPageTitle>
            <MainPageDescripton>
              Kelola rekening bank Anda dan pantau saldo di seluruh akun dengan mudah.
            </MainPageDescripton>
          </div>

          <Button
            onClick={handleAddAccount}
            size="xl"
            className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
          >
            <PlusIcon className="size-4" />
            <span className="hidden md:block">Tambah Rekening</span>
          </Button>
        </MainPageHeader>

        <QueryErrorBoundary>
          <BankAccountList onDelete={handleDeleteAccount} />
        </QueryErrorBoundary>

        <ResponsiveDialog
          title="Tambah Rekening"
          description="Tambahkan rekening bank baru untuk memantau saldo Anda."
          open={addDialogOpen}
          onOpenChange={handleAddDialogClose}
        >
          <BankAccountForm mode="create" onSuccess={handleAddDialogClose} />
        </ResponsiveDialog>

        <ResponsiveDialog
          title={`Hapus rekening ${selectedAccount?.bank.name}?`}
          description="Rekening ini akan dihapus secara permanen. Pilih tindakan untuk transaksi yang tertaut."
          open={deleteDialogOpen}
          onOpenChange={handleDeleteDialogClose}
        >
          <BankAccountDelete data={selectedAccount} close={handleDeleteDialogClose} />
        </ResponsiveDialog>
      </MainPage>
    </>
  )
}
