"use client"

import { QueryErrorBoundary } from "@/components/query-error-boundary"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import CategoryCardSkeleton from "@/features/category/components/category-card-skeleton"
import { CategoryFilterTab } from "@/features/category/components/category-filter-tab"
import { CategoryProvider } from "@/features/category/provider/category.provider"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const CategoryList = dynamic(() => import("@/features/category/components/categories-list"), {
  ssr: false,
  loading: () => <CategoryCardSkeleton />,
})

const CategoryDialogs = dynamic(() => import("@/features/category/components/category-dialogs"), {
  ssr: false,
})

export default function CategoryPage() {
  return (
    <CategoryProvider>
      <SiteHeader label="Kategori" />
      <MainPage className="@container/main">
        {/* Header */}
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Category</MainPageTitle>
            <MainPageDescripton>Manage your expense and income categories.</MainPageDescripton>
          </div>
        </MainPageHeader>

        {/* Filter tab */}
        <Suspense>
          <CategoryFilterTab />
        </Suspense>

        <QueryErrorBoundary>
          <CategoryList />
        </QueryErrorBoundary>

        {/* Category dialogs - create, edit, delete */}
        <CategoryDialogs />
      </MainPage>
    </CategoryProvider>
  )
}
