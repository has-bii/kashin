"use client"
import { QueryErrorBoundary } from "@/components/query-error-boundary"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import dynamic from "next/dynamic"

const AiExtractionList = dynamic(
  () => import("@/features/ai-extraction/components/ai-extraction-list"),
  {
    ssr: false,
  },
)

export default function AiExtractionPage() {
  return (
    <>
      <SiteHeader label="AI Extraction" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Email Imports</MainPageTitle>
            <MainPageDescripton>
              This is where we turn your receipts into data. Track every email we’ve found and see
              how the AI is doing.
            </MainPageDescripton>
          </div>
        </MainPageHeader>

        <QueryErrorBoundary>
          <AiExtractionList />
        </QueryErrorBoundary>
      </MainPage>
    </>
  )
}
