import { Transaction } from "@/features/transaction/types"

export function formatAmount(amount: string, type: Transaction["type"], currency: string): string {
  const num = parseFloat(amount)
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(Math.abs(num))
  return type === "expense" ? `-${formatted}` : `+${formatted}`
}
