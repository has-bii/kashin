"use client"

import { getCategoriesQueryOptions } from "../api/get-categories.query"
import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { Category } from "../types"
import { CategoryCard } from "./category-card"
import CategoryDelete from "./category-delete"
import { CategoryForm } from "./category-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
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

  // Delete state
  const [categoryDelete, setCategoryDelete] = React.useState<{
    state: boolean
    data: Category | null
  }>({ state: false, data: null })
  const selectCategoryDelete = (data: Category) => setCategoryDelete({ state: true, data })
  const closeCategoryDelete = () => setCategoryDelete((prev) => ({ ...prev, state: false }))

  return (
    <>
      {data.map((category) => (
        <CategoryCard
          key={category.id}
          data={category}
          onUpdate={() => selectCategoryUpdate(category)}
          onDelete={() => selectCategoryDelete(category)}
        />
      ))}

      {/* Create category */}
      <ResponsiveDialog
        title="New Category"
        description="Define your expense/income category"
        trigger={
          <div
            role="button"
            className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-4xl border-4 border-dashed"
          >
            <Button size="icon-xl">
              <Plus />
            </Button>
            <p className="text-primary text-lg font-medium">Create new</p>
          </div>
        }
      >
        <CategoryForm mode="create" />
      </ResponsiveDialog>

      <ResponsiveDialog
        key={categoryUpdate.data?.id}
        title="Edit Category"
        description="Define your expense/income category"
        open={categoryUpdate.state}
        onOpenChange={closeCategoryUpdate}
      >
        <CategoryForm mode="update" data={categoryUpdate.data} />
      </ResponsiveDialog>

      <ResponsiveDialog
        title={`Delete "${categoryDelete.data?.name}"?`}
        description="This will permanently delete the category. This action cannot be undone."
        open={categoryDelete.state}
        onOpenChange={closeCategoryDelete}
      >
        <CategoryDelete data={categoryDelete.data} close={closeCategoryDelete} />
      </ResponsiveDialog>
    </>
  )
}
