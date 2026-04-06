import { TransactionType } from "@/types/enums"
import { parseAsStringEnum, useQueryState } from "nuqs"

export const useGetCategoryFilter = () => {
  const [type, setType] = useQueryState(
    "type",
    parseAsStringEnum<TransactionType>(["expense", "income"]),
  )

  return { type, setType }
}
