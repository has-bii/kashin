import { parseAsDate } from "@/lib/nuqs-parser"
import { TransactionType } from "@/types/enums"
import { endOfMonth, startOfMonth } from "date-fns"
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

export const useTransactionFilters = () => {
  const [filters, setFilters] = useQueryStates(
    {
      type: parseAsStringEnum<TransactionType>(["expense", "income"]),
      categoryId: parseAsString,
      dateFrom: parseAsDate.withDefault(startOfMonth(new Date())),
      dateTo: parseAsDate.withDefault(endOfMonth(new Date())),
      search: parseAsString,
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
      clearOnDefault: true,
    },
  )

  return {
    filters,
    setFilters,
  }
}
