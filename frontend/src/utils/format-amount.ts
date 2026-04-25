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

export function formatCurrency(
  amount: number | string,
  options?: Intl.NumberFormatOptions,
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: DECIMAL,
    ...options,
  }).format(num)
}

export function currencyToNumber(amount: string) {
  const cleanStr = amount.replace(/\./g, "").replace(/[^0-9.-]+/g, "")

  return parseFloat(cleanStr || "0")
}
