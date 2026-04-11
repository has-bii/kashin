"use client"

import { getBudgetsQueryOptions } from "../api/get-budgets.query"
import { Budget } from "../types"
import { BudgetCard } from "./budget-card"
import BudgetDelete from "./budget-delete"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import React from "react"

type Props = {
  onAdd: () => void
  onUpdate: (budget: Budget) => void
}

export default function BudgetList({ onAdd, onUpdate }: Props) {
  const { data: budgets } = useSuspenseQuery(getBudgetsQueryOptions())

  const [selectedBudget, setSelectedBudget] = React.useState<Budget | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const handleDeleteClick = (budget: Budget) => {
    setSelectedBudget(budget)
    setDeleteOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false)
    setTimeout(() => setSelectedBudget(null), 200)
  }

  return (
    <>
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          data={budget}
          onUpdate={() => onUpdate(budget)}
          onDelete={() => handleDeleteClick(budget)}
        />
      ))}

      {budgets.length < 10 && (
        <div
          role="button"
          onClick={onAdd}
          className="flex aspect-video flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed"
        >
          <Button size="icon-xl">
            <Plus />
          </Button>
          <p className="text-primary text-lg font-medium">New budget</p>
        </div>
      )}

      <ResponsiveDialog
        title={`Delete budget?`}
        description="This will permanently remove this budget. Transactions are not affected."
        open={deleteOpen}
        onOpenChange={handleDeleteClose}
      >
        <BudgetDelete data={selectedBudget} close={handleDeleteClose} />
      </ResponsiveDialog>
    </>
  )
}
