"use client"

import { getCategoriesQueryOptions } from "../api/get-categories.query"
import { useGetCategoryFilter } from "../hooks/use-get-category-filter"
import { Category } from "../types"
import { CategoryCard } from "./category-card"
import CategoryDelete from "./category-delete"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import React from "react"

type Props = {
  handleAddCategoryAction: () => void
  handleUpdateCategoryAction: (category: Category) => void
}

export default function CategoriesList({
  handleAddCategoryAction,
  handleUpdateCategoryAction,
}: Props) {
  const { type } = useGetCategoryFilter()
  const { data } = useSuspenseQuery(getCategoriesQueryOptions({ type }))

  // Delete state
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  // Handler
  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }
  const handleDialogClose = () => {
    setDialogOpen(false)
    setTimeout(() => setSelectedCategory(null), 200)
  }

  return (
    <>
      {data.map((category) => (
        <CategoryCard
          key={category.id}
          data={category}
          onUpdate={() => handleUpdateCategoryAction(category)}
          onDelete={() => handleDeleteCategory(category)}
        />
      ))}

      {/* Create category */}
      <div
        onClick={handleAddCategoryAction}
        role="button"
        className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-4xl border-4 border-dashed"
      >
        <Button size="icon-xl">
          <Plus />
        </Button>
        <p className="text-primary text-lg font-medium">Create new</p>
      </div>

      {/* Delete category */}
      <ResponsiveDialog
        title={`Delete "${selectedCategory?.name}"?`}
        description="This will permanently delete the category. This action cannot be undone."
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      >
        <CategoryDelete data={selectedCategory} close={handleDialogClose} />
      </ResponsiveDialog>
    </>
  )
}
