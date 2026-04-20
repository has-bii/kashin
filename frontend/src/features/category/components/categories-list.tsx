"use client"

import { useCategoryContext } from "../hooks/use-category-context"
import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { getCategoriesQueryOptions } from "../query"
import { CategoryCard } from "./category-card"
import { Button } from "@/components/ui/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"

export default function CategoriesList() {
  const { type } = useGetCategoryFilter()
  const { data } = useSuspenseQuery(getCategoriesQueryOptions({ type }))

  const { handleAddCategory } = useCategoryContext()

  return (
    <div className="grid grid-cols-1 gap-4 @sm/main:grid-cols-2 @xl/main:grid-cols-3 @3xl/main:grid-cols-4">
      {data.map((category) => (
        <CategoryCard key={category.id} data={category} />
      ))}

      {/* Create category */}
      <div
        onClick={handleAddCategory}
        role="button"
        className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-4xl border-4 border-dashed"
      >
        <Button size="icon-lg">
          <Plus />
        </Button>
        <p className="text-primary text-lg font-medium">Create Category</p>
      </div>
    </div>
  )
}
