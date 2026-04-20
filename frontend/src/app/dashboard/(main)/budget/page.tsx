import { QueryErrorBoundary } from "@/components/query-error-boundary"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import BudgetCardSkeleton from "@/features/budget/components/budget-card-skeleton"
import { BudgetProvider } from "@/features/budget/provider/budget.provider"
import dynamic from "next/dynamic"

const BudgetList = dynamic(() => import("@/features/budget/components/budget-list"), {
  ssr: false,
  loading: () => <BudgetCardSkeleton />,
})

const BudgetDialogs = dynamic(() => import("@/features/budget/components/budget-dialogs"), {
  ssr: false,
})

export default function BudgetPage() {
  return (
    <>
      <SiteHeader label="Anggaran" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Anggaran</MainPageTitle>
            <MainPageDescripton>
              Tetapkan batas pengeluaran per kategori dan pantau realisasinya secara berkala.
            </MainPageDescripton>
          </div>
        </MainPageHeader>

        <BudgetProvider>
          <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
            <QueryErrorBoundary>
              <BudgetList />
            </QueryErrorBoundary>
          </div>
          <BudgetDialogs />
        </BudgetProvider>
      </MainPage>
    </>
  )
}
