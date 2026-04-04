"use client"

import { getCategoriesQueryOptions } from "../api/get-categories.query"
import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { Category } from "../types"
import CategoryAddCard from "./category-add-card"
import { CategoryCard } from "./category-card"
import { CategoryUpdateForm } from "./category-update-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { useSuspenseQuery } from "@tanstack/react-query"
import React from "react"

export default function CategoriesList() {
  const { type } = useGetCategoryFilter()
  const { data } = useSuspenseQuery({ ...getCategoriesQueryOptions({ type }) })

  // Update state
  const [categoryUpdate, setCategoryUpdate] = React.useState<{
    state: boolean
    data: Category | null
  }>({ state: false, data: null })
  const selectCategoryUpdate = (data: Category) => setCategoryUpdate({ state: true, data })
  const closeCategoryUpdate = () => setCategoryUpdate((prev) => ({ ...prev, state: false }))

  return (
    <>
      {data.map((category) => (
        <CategoryCard
          key={category.id}
          data={category}
          onUpdate={() => selectCategoryUpdate(category)}
        />
      ))}

      <CategoryAddCard />

      <ResponsiveDialog
        title="Edit Category"
        description="Define your expense/income category"
        open={categoryUpdate.state}
        onOpenChange={closeCategoryUpdate}
      >
        <CategoryUpdateForm data={categoryUpdate.data} />
      </ResponsiveDialog>
    </>
  )
}
