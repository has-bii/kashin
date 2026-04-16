"use client"

import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import dynamic from "next/dynamic"
import { Suspense } from "react"

export default function EmailAutomationPage() {
  return (
    <>
      <SiteHeader label="Email" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Email Automation</MainPageTitle>
            <MainPageDescripton></MainPageDescripton>
          </div>
        </MainPageHeader>
        {/* 
        <Suspense fallback={<EmailAutomationSkeleton />}>
          <EmailAutomationPanel />
        </Suspense> */}
      </MainPage>
    </>
  )
}
