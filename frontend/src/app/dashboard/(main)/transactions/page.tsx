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
import { TransactionForm } from "@/features/transaction/components/transaction-form"
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

function TransactionsPageInner() {
  const { selectedTransaction, dialogOpen, dialogMode, handleAddTransaction, handleDialogClose } =
    useTransactionContext()

  const dialogTitle = dialogMode === "create" ? "Tambah Transaksi" : "Ubah Transaksi"
  const dialogDescription =
    dialogMode === "create"
      ? "Catat pengeluaran atau pemasukan baru."
      : "Perbarui detail transaksi ini."

  return (
    <>
      <SiteHeader label="Transaksi" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Transaksi</MainPageTitle>
            <MainPageDescripton>
              Tinjau dan kelola riwayat keuangan Anda. Setiap transaksi adalah langkah nyata menuju
              kemakmuran finansial jangka panjang.
            </MainPageDescripton>
          </div>

          <Button
            onClick={handleAddTransaction}
            size="lg"
            className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
          >
            <PlusIcon className="size-4" />
            <span className="hidden md:block">Tambah Transaksi</span>
          </Button>
        </MainPageHeader>

        <QueryErrorBoundary>
          <TransactionFilterBar />
        </QueryErrorBoundary>

        <QueryErrorBoundary>
          <TransactionList />
        </QueryErrorBoundary>

        <ResponsiveDialog
          title={dialogTitle}
          description={dialogDescription}
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

export default function TransactionsPage() {
  return (
    <TransactionProvider>
      <TransactionsPageInner />
    </TransactionProvider>
  )
}
