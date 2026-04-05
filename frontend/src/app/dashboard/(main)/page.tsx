import dynamic from "next/dynamic"
import { SiteHeader } from "@/components/sidebar/site-header"
import {
  SectionCardsSkeleton,
  ChartSkeleton,
  TransactionsSkeleton,
} from "@/features/dashboard/components/DashboardSkeleton"

const SectionCards = dynamic(
  () => import("@/features/dashboard/components/SectionCards").then((mod) => mod.SectionCards),
  { ssr: false, loading: () => <SectionCardsSkeleton /> }
)

const MonthlyTrendsChart = dynamic(
  () => import("@/features/dashboard/components/MonthlyTrendsChart").then((mod) => mod.MonthlyTrendsChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

const CategoryBreakdownChart = dynamic(
  () => import("@/features/dashboard/components/CategoryBreakdownChart").then((mod) => mod.CategoryBreakdownChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

const RecentTransactionsWidget = dynamic(
  () => import("@/features/dashboard/components/RecentTransactionsWidget").then((mod) => mod.RecentTransactionsWidget),
  { ssr: false, loading: () => <TransactionsSkeleton /> }
)

export default function Page() {
  return (
    <>
      <SiteHeader label="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
              <MonthlyTrendsChart />
              <CategoryBreakdownChart />
            </div>
            <RecentTransactionsWidget />
          </div>
        </div>
      </div>
    </>
  )
}
