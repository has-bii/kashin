"use client"

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
      <SiteHeader label="Budgets" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Budgets</MainPageTitle>
            <MainPageDescripton>
              Set a limit for your spending so you don&apos;t have to worry about it later. Pick a
              category, pick a number, and stay on track.
            </MainPageDescripton>
          </div>
        </MainPageHeader>

        <BudgetProvider>
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @3xl/main:grid-cols-3">
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
