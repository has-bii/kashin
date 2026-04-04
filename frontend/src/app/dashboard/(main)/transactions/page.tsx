"use client"

import { MainPage, MainPageHeader, MainPageTitle } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const TransactionList = dynamic(
  () => import("@/features/transaction/components/transaction-list"),
  {
    ssr: false,
    loading: () => (
      <>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </>
    ),
  },
)

export default function TransactionsPage() {
  return (
    <>
      <SiteHeader label="Transactions" />
      <MainPage>
        {/* Header */}
        <MainPageHeader>
          <MainPageTitle>Transactions</MainPageTitle>
          {/* Placeholder: Export button (Plan 02) */}
          <div />
          {/* Placeholder: Add Transaction button (Plan 04) */}
          <div />
        </MainPageHeader>

        {/* Main content */}
        <Suspense>
          <TransactionList />
        </Suspense>
      </MainPage>
    </>
  )
}
