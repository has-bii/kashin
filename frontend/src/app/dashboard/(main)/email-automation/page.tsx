"use client"

import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import EmailAutomationSkeleton from "@/features/email-automation/components/email-automation-skeleton"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const EmailAutomationPanel = dynamic(
  () => import("@/features/email-automation/components/email-automation-panel"),
  { ssr: false, loading: () => <EmailAutomationSkeleton /> },
)

export default function EmailAutomationPage() {
  return (
    <>
      <SiteHeader label="Email Automation" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Email Automation</MainPageTitle>
            <MainPageDescripton>
              Set up Gmail watch and bulk import emails from a date range.
            </MainPageDescripton>
          </div>
        </MainPageHeader>

        <Suspense fallback={<EmailAutomationSkeleton />}>
          <EmailAutomationPanel />
        </Suspense>
      </MainPage>
    </>
  )
}
