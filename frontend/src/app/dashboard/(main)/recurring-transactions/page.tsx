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
import { RecurringTransactionListSkeleton } from "@/features/recurring-transaction/components/recurring-transaction-list-skeleton"
import { RecurringTransactionForm } from "@/features/recurring-transaction/components/recurring-transaction-form"
import type { RecurringTransaction } from "@/features/recurring-transaction/types"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"

const RecurringTransactionList = dynamic(
  () => import("@/features/recurring-transaction/components/recurring-transaction-list"),
  {
    ssr: false,
    loading: () => <RecurringTransactionListSkeleton />,
  },
)

export default function RecurringTransactionsPage() {
  const [selectedItem, setSelectedItem] = useState<RecurringTransaction | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const dialogMode = useMemo(() => (selectedItem ? "edit" : "create"), [selectedItem])

  const handleRowClick = (item: RecurringTransaction) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedItem(null)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setTimeout(() => setSelectedItem(null), 200)
  }

  const dialogInfo = useMemo(
    () => ({
      title: dialogMode === "create" ? "Tambah Transaksi Berulang" : "Ubah Transaksi Berulang",
      description:
        dialogMode === "create"
          ? "Atur pengeluaran atau pemasukan berulang baru."
          : "Perbarui transaksi berulang ini.",
    }),
    [dialogMode],
  )

  return (
    <>
      <SiteHeader label="Transaksi Berulang" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Transaksi Berulang</MainPageTitle>
            <MainPageDescripton>
              Otomatiskan pengeluaran dan pemasukan rutin Anda. Atur sekali, Kashin yang mengelola sisanya.
            </MainPageDescripton>
          </div>

          <Button
            onClick={handleAdd}
            size="xl"
            className="fixed right-4 bottom-4 md:relative md:right-0 md:bottom-0"
          >
            <PlusIcon className="size-4" />
            <span className="hidden md:block">Tambah Berulang</span>
          </Button>
        </MainPageHeader>

        <QueryErrorBoundary>
          <RecurringTransactionList onRowClick={handleRowClick} />
        </QueryErrorBoundary>

        <ResponsiveDialog
          title={dialogInfo.title}
          description={dialogInfo.description}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
        >
          {dialogMode === "create" ? (
            <RecurringTransactionForm mode="create" onSuccess={handleDialogClose} />
          ) : (
            <RecurringTransactionForm
              mode="edit"
              data={selectedItem!}
              onSuccess={handleDialogClose}
            />
          )}
        </ResponsiveDialog>
      </MainPage>
    </>
  )
}
