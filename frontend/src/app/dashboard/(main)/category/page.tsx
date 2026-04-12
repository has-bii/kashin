"use client"

import { QueryErrorBoundary } from "@/components/query-error-boundary"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import CategoryCardSkeleton from "@/features/category/components/category-card-skeleton"
import { CategoryFilterTab } from "@/features/category/components/category-filter-tab"
import { CategoryForm } from "@/features/category/components/category-form"
import { Category } from "@/features/category/types"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"

const CategoryList = dynamic(() => import("@/features/category/components/categories-list"), {
  ssr: false,
  loading: () => <CategoryCardSkeleton />,
})

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const dialogMode = selectedCategory ? "update" : "create"

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  const handleUpdateCategory = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)

    if (!open) {
      setTimeout(() => setSelectedCategory(null), 200)
    }
  }

  const dialogTitle = dialogMode === "create" ? "New Category" : "Edit Category"
  const DialogDescription = "Define your expense/income category"

  return (
    <>
      <SiteHeader label="Category" />
      <MainPage>
        {/* Header */}
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Categories</MainPageTitle>
            <MainPageDescripton>
              A curated library of your spending patterns and income streams.
            </MainPageDescripton>
          </div>
        </MainPageHeader>

        {/* Filter tab */}
        <Suspense>
          <CategoryFilterTab />
        </Suspense>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QueryErrorBoundary>
            <CategoryList
              handleAddCategoryAction={handleAddCategory}
              handleUpdateCategoryAction={handleUpdateCategory}
            />
          </QueryErrorBoundary>
        </div>

        {/* Category dialog - create or edit mode */}
        <ResponsiveDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          title={dialogTitle}
          description={DialogDescription}
        >
          <CategoryForm mode={dialogMode} data={selectedCategory} />
        </ResponsiveDialog>
      </MainPage>
    </>
  )
}
