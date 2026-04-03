/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { Button } from "@/components/ui/button"
import { TransactionType } from "@/types/enums"

const TYPES: Array<{ label: string; value: TransactionType | null }> = [
  { label: "All", value: null },
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
]

export function CategoryFilterTab() {
  const { type, setType } = useGetCategoryFilter()

  return (
    <div className="inline-flex items-center gap-2">
      {TYPES.map((item) => (
        <Button
          key={item.label}
          variant={type === item.value ? "secondary" : "ghost"}
          onClick={() => setType(item.value as any)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}
