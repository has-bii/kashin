import { TransactionContext } from "../context/transaction.context"
import { useContext } from "react"

export const useTransactionContext = () => {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error("useTransactionContext must be used within TransactionProvider")
  return ctx
}
