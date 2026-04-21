"use client"

import { QueryErrorBoundary } from "@/components/query-error-boundary"
import { MainPage } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import SettingFormSkeleton from "@/features/settings/components/setting-form-skeleton"
import dynamic from "next/dynamic"

const AccessPermission = dynamic(
  () => import("@/features/settings/app/components/access-permission"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)

const GmailWatchSettings = dynamic(
  () => import("@/features/settings/app/components/gmail-watch-settings"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)

export default function SettingsAppPage() {
  return (
    <>
      <SiteHeader label="Application Settings" />
      <MainPage className="space-y-4">
        <QueryErrorBoundary>
          <AccessPermission />
        </QueryErrorBoundary>
        <QueryErrorBoundary>
          <GmailWatchSettings />
        </QueryErrorBoundary>
      </MainPage>
    </>
  )
}
