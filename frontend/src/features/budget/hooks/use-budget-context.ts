import { BudgetContext } from "../context/budget.context"
import { useContext } from "react"

export const useBudgetContext = () => {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error("useBudgetContext must be used within a BudgetProvider")
  }
  return context
}
