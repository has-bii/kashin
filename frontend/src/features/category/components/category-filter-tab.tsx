"use client"

import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { SelectTab, SelectTabItem } from "@/components/select-tab"
import { TransactionType } from "@/types/enums"

const TYPES: Array<{ label: string; value: TransactionType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
]

export function CategoryFilterTab() {
  const { type, setType } = useGetCategoryFilter()

  const onChangeValue = (value: string) =>
    setType(value === "all" ? null : (value as TransactionType))

  return (
    <SelectTab className="md:max-w-xs" value={type ? type : "all"} onChangeValue={onChangeValue}>
      {TYPES.map((item) => (
        <SelectTabItem key={item.label} value={item.value}>
          {item.label}
        </SelectTabItem>
      ))}
    </SelectTab>
  )
}
