import { QueryErrorBoundary } from "@/components/query-error-boundary"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"

export default function AiExtractionPage() {
  return (
    <>
      <SiteHeader label="AI Extraction" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>AI Extraction</MainPageTitle>
            <MainPageDescripton>
              This is where we turn your receipts into data. Track every email we’ve found and see
              how the AI is doing.
            </MainPageDescripton>
          </div>
        </MainPageHeader>

        {/* <QueryErrorBoundary> */}
        {/* <BudgetList /> */}
        {/* </QueryErrorBoundary> */}
      </MainPage>
    </>
  )
}
