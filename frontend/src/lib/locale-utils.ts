const CURRENCY_LOCALE: Record<string, Intl.LocalesArgument> = {
  IDR: "id-ID",
  USD: "en-US",
  EUR: "de-DE",
  JPY: "ja-JP",
}

export function getCurrencyLocale(currency: string): Intl.LocalesArgument {
  return CURRENCY_LOCALE[currency] ?? "en-US"
}

export function formatCurrency(amount: number | string, currency: string): string {
  const locale = getCurrencyLocale(currency)
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(num)
}
