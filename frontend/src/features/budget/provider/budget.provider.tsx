import { BudgetContext, BudgetContextType } from "../context/budget.context"
import { Budget } from "../types"
import React from "react"

type Props = {
  children: React.ReactNode
}

export function BudgetProvider({ children }: Props) {
  /* ------------------- Create / Update state ------------------- */
  const [selectedBudget, setSelectedBudget] = React.useState<Budget | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const dialogMode = selectedBudget ? "update" : "create"

  const handleAddBudget = () => {
    setSelectedBudget(null)
    setDialogOpen(true)
  }

  const handleUpdateBudget = (budget: Budget) => {
    setSelectedBudget(budget)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  /* ----------------------- Delete state ------------------------ */
  const [selectedDeleteBudget, setSelectedDeleteBudget] = React.useState<Budget | null>(null)
  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false)

  const handleDeleteBudget = (budget: Budget) => {
    setSelectedDeleteBudget(budget)
    setDialogDeleteOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDialogDeleteOpen(false)
  }

  const value: BudgetContextType = {
    selectedBudget,
    dialogOpen,
    dialogMode,
    handleAddBudget,
    handleUpdateBudget,
    handleDialogClose,
    dialogDeleteOpen,
    selectedDeleteBudget,
    handleDeleteBudget,
    handleDeleteDialogClose,
  }

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}
