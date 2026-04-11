"use client"

import { MainPage } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import {
  ChartSkeleton,
  SectionCardsSkeleton,
  TransactionsSkeleton,
} from "@/features/dashboard/components/dashboard-skeleton"
import dynamic from "next/dynamic"

const SectionCards = dynamic(() => import("@/features/dashboard/components/section-cards"), {
  ssr: false,
  loading: () => <SectionCardsSkeleton />,
})

const MonthlyTrendsChart = dynamic(
  () => import("@/features/dashboard/components/monthly-trends-chart"),
  { ssr: false, loading: () => <ChartSkeleton /> },
)

const CategoryBreakdownChart = dynamic(
  () => import("@/features/dashboard/components/category-breakdown-chart"),
  { ssr: false, loading: () => <ChartSkeleton /> },
)

const RecentTransactionsWidget = dynamic(
  () => import("@/features/dashboard/components/recent-transactions-widget"),
  { ssr: false, loading: () => <TransactionsSkeleton /> },
)

export default function Page() {
  return (
    <>
      <SiteHeader label="Dashboard" />
      <MainPage className="@container/main gap-6 p-6">
        <SectionCards />
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
          <MonthlyTrendsChart />
          <CategoryBreakdownChart />
        </div>
        <RecentTransactionsWidget />
      </MainPage>
    </>
  )
}
