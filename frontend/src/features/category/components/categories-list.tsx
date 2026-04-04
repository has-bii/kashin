"use client"

import { getCategoriesQueryOptions } from "../api/get-categories.query"
import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { CategoryCard } from "./category-card"
import EmptyState from "@/components/empty-state"
import { useSuspenseQuery } from "@tanstack/react-query"
import { LayersIcon } from "lucide-react"

export default function CategoriesList() {
  const { type } = useGetCategoryFilter()

  const { data } = useSuspenseQuery({ ...getCategoriesQueryOptions({ type }) })

  return (
    <>
      {data.length === 0 && (
        <EmptyState
          title="Category Empty"
          description="You don't have any category. Create expense/income categories."
          icon={LayersIcon}
          className="border border-dashed"
        />
      )}
      {data.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </>
  )
}
