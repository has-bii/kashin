"use client"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import {
  MainPage,
  MainPageAction,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import { Button } from "@/components/ui/button"
import { CategoryCardSkeleton } from "@/features/category/components/category-card-skeleton"
import { CategoryCreateForm } from "@/features/category/components/category-create-form"
import { CategoryFilterTab } from "@/features/category/components/category-filter-tab"
import { Plus } from "lucide-react"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const CategoryList = dynamic(() => import("@/features/category/components/categories-list"), {
  ssr: false,
  loading: () => (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </>
  ),
})

export default function CategoryPage() {
  return (
    <>
      <SiteHeader label="Category" />
      <MainPage>
        {/* Header */}
        <MainPageHeader>
          <MainPageTitle>Category</MainPageTitle>
          <MainPageAction>
            <ResponsiveDialog
              title="New Category"
              description="Define your expense/income category"
              trigger={
                <Button>
                  Add <Plus />
                </Button>
              }
            >
              <CategoryCreateForm />
            </ResponsiveDialog>
          </MainPageAction>
        </MainPageHeader>

        {/* Filter tab */}
        <Suspense>
          <CategoryFilterTab />
        </Suspense>

        <div className="flex flex-col gap-2">
          <CategoryList />
        </div>
      </MainPage>
    </>
  )
}
