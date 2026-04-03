"use client"

import { getCategoriesQueryOptions } from "../api/get-categories.query"
import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { CategoryCard } from "./category-card"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function CategoriesList() {
  const { type } = useGetCategoryFilter()

  const { data } = useSuspenseQuery({ ...getCategoriesQueryOptions({ type: type ?? undefined }) })

  return (
    <>
      {data.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </>
  )
}
