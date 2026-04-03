/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { Button } from "@/components/ui/button"
import { TransactionType } from "@/types/enums"

const TYPES: Array<{ label: string; value: null | TransactionType }> = [
  { label: "all", value: null },
  { label: "expense", value: "expense" },
  { label: "income", value: "income" },
]

export function CategoryFilterTab() {
  const { type, setType } = useGetCategoryFilter()

  return (
    <div className="inline-flex items-center gap-2">
      {TYPES.map((item) => (
        <Button
          key={item.label}
          className="capitalize"
          variant={type === item.value ? "secondary" : "ghost"}
          onClick={() => setType(item.value as any)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}
