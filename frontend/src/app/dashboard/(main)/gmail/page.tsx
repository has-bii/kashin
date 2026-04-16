"use client"

import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import dynamic from "next/dynamic"

const MessagesList = dynamic(() => import("@/features/gmail/components/messages-list"), {
  ssr: false,
})

export default function EmailAutomationPage() {
  return (
    <>
      <SiteHeader label="Gmail Inbox" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Gmail Inbox</MainPageTitle>
            <MainPageDescripton></MainPageDescripton>
          </div>
        </MainPageHeader>
        <MessagesList />
      </MainPage>
    </>
  )
}
