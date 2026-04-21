import { BankAccountContext } from "../context/bank-account.context"
import { use } from "react"

export const useBankAccountContext = () => {
  const context = use(BankAccountContext)
  if (!context) throw new Error("useBankAccountContext must be used within BankAccountProvider")
  return context
}
