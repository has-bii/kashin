"use client"

import { QueryErrorBoundary } from "@/components/query-error-boundary"
import {
  MainPage,
  MainPageDescripton,
  MainPageHeader,
  MainPageTitle,
} from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import { MessagesListSkeleton } from "@/features/gmail/components/messages-list-skeleton"
import { GmailProvider } from "@/features/gmail/provider/gmail.provider"
import dynamic from "next/dynamic"

const MessagesList = dynamic(() => import("@/features/gmail/components/messages-list"), {
  ssr: false,
  loading: () => <MessagesListSkeleton />,
})

export default function GmailPage() {
  return (
    <>
      <SiteHeader label="Gmail Inbox" />
      <MainPage className="@container/main">
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>Gmail Inbox</MainPageTitle>
            <MainPageDescripton>Import transactions from your Gmail messages</MainPageDescripton>
          </div>
        </MainPageHeader>
        <GmailProvider>
          <QueryErrorBoundary>
            <MessagesList />
          </QueryErrorBoundary>
        </GmailProvider>
      </MainPage>
    </>
  )
}
