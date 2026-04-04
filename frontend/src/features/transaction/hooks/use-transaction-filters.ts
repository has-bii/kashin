import { TransactionType } from "@/types/enums"
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

const getCurrentMonthRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return { start: fmt(start), end: fmt(end) }
}

export const useTransactionFilters = () => {
  const [filters, setFilters] = useQueryStates({
    type: parseAsStringEnum<TransactionType>(["expense", "income"]),
    categoryId: parseAsString,
    dateFrom: parseAsString,
    dateTo: parseAsString,
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
  })

  const { start: defaultDateFrom, end: defaultDateTo } = getCurrentMonthRange()

  const resolvedDateFrom = filters.dateFrom ?? defaultDateFrom
  const resolvedDateTo = filters.dateTo ?? defaultDateTo

  return {
    filters,
    setFilters,
    resolvedDateFrom,
    resolvedDateTo,
  }
}
