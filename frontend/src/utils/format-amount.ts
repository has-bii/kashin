import { CURRENCY, DECIMAL, LOCALE } from "@/constants/indonesia"
import { Transaction } from "@/features/transaction/types"

export function formatAmount(amount: string, type: Transaction["type"]): string {
  const num = parseFloat(amount)
  const formatted = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: DECIMAL,
  }).format(Math.abs(num))
  return type === "expense" ? `-${formatted}` : `+${formatted}`
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: DECIMAL,
  }).format(num)
}
