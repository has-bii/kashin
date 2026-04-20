"use client"

import { useBudgetContext } from "../hooks/use-budget-context"
import { getBudgetsQueryOptions } from "../query"
import { BudgetCard } from "./budget-card"
import { Button } from "@/components/ui/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"

export default function BudgetList() {
  const { data: budgets } = useSuspenseQuery(getBudgetsQueryOptions())
  const { handleAddBudget } = useBudgetContext()

  return (
    <>
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} data={budget} />
      ))}

      {budgets.length < 10 && (
        <div
          role="button"
          onClick={handleAddBudget}
          className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed"
        >
          <Button size="icon-lg">
            <Plus />
          </Button>
          <p className="text-primary text-lg font-medium">Anggaran baru</p>
        </div>
      )}
    </>
  )
}
