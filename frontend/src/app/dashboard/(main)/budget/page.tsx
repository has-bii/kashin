"use client"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import BudgetCardSkeleton from "@/features/budget/components/budget-card-skeleton"
import { Budget } from "@/features/budget/types"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"

const BudgetList = dynamic(() => import("@/features/budget/components/budget-list"), {
  ssr: false,
  loading: () => <BudgetCardSkeleton />,
})

const BudgetForm = dynamic(() => import("@/features/budget/components/budget-form"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full items-center justify-center">
      <Loader2 className="size-20 animate-spin" />
    </div>
  ),
})

export default function BudgetPage() {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const dialogMode = selectedBudget ? "update" : "create"

  const handleAdd = () => {
    setSelectedBudget(null)
    setDialogOpen(true)
  }

  const handleUpdate = (budget: Budget) => {
    setSelectedBudget(budget)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setTimeout(() => setSelectedBudget(null), 200)
  }

  return (
    <>
      <SiteHeader label="Budget" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Budgets</MainPageTitle>
            <MainPageDescripton>
              Set spending limits per category and track your progress.
            </MainPageDescripton>
          </div>
        </MainPageHeader>

        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @2xl/main:grid-cols-3">
          <Suspense fallback={<BudgetCardSkeleton />}>
            <BudgetList onAdd={handleAdd} onUpdate={handleUpdate} />
          </Suspense>
        </div>

        <ResponsiveDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          title={dialogMode === "create" ? "New Budget" : "Edit Budget"}
          description="Set a spending limit for a category over a time period."
        >
          <BudgetForm mode={dialogMode} data={selectedBudget} />
        </ResponsiveDialog>
      </MainPage>
    </>
  )
}
