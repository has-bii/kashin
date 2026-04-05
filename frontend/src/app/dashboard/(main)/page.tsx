import { Suspense } from "react"
import { CategoryBreakdownChart } from "@/features/dashboard/components/CategoryBreakdownChart"
import { MonthlyTrendsChart } from "@/features/dashboard/components/MonthlyTrendsChart"
import { RecentTransactionsWidget } from "@/features/dashboard/components/RecentTransactionsWidget"
import { SectionCards } from "@/features/dashboard/components/SectionCards"
import {
  ChartSkeleton,
  SectionCardsSkeleton,
  TransactionsSkeleton,
} from "@/features/dashboard/components/DashboardSkeleton"
import { SiteHeader } from "@/components/sidebar/site-header"

export default function Page() {
  return (
    <>
      <SiteHeader label="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense fallback={<SectionCardsSkeleton />}>
              <SectionCards />
            </Suspense>
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
              <Suspense fallback={<ChartSkeleton />}>
                <MonthlyTrendsChart />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <CategoryBreakdownChart />
              </Suspense>
            </div>
            <Suspense fallback={<TransactionsSkeleton />}>
              <RecentTransactionsWidget />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
