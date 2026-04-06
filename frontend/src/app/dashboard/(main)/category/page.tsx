"use client"

import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import CategoryCardSkeleton from "@/features/category/components/category-card-skeleton"
import { CategoryFilterTab } from "@/features/category/components/category-filter-tab"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const CategoryList = dynamic(() => import("@/features/category/components/categories-list"), {
  ssr: false,
  loading: () => <CategoryCardSkeleton />,
})

export default function CategoryPage() {
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
          <CategoryList />
        </div>
      </MainPage>
    </>
  )
}
