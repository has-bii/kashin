import { Transaction } from "@/features/transaction/types"

type FormatAmountOptions = {
  type: Transaction["type"]
  currency: string
  locale: string
  decimal: number
}

export function formatAmount(
  amount: string,
  { locale, currency, type, decimal }: FormatAmountOptions,
): string {
  const num = parseFloat(amount)
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimal,
  }).format(Math.abs(num))
  return type === "expense" ? `-${formatted}` : `+${formatted}`
}
