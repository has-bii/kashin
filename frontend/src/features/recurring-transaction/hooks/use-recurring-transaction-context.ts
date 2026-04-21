import { RecurringTransactionContext } from "../context/recurring-transaction.context"
import { useContext } from "react"

export const useRecurringTransactionContext = () => {
  const ctx = useContext(RecurringTransactionContext)
  if (!ctx)
    throw new Error(
      "useRecurringTransactionContext must be used within RecurringTransactionProvider",
    )
  return ctx
}
