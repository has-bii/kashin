"use client"

import { QueryErrorBoundary } from "@/components/query-error-boundary"
import { MainPage } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import SettingFormSkeleton from "@/features/settings/components/setting-form-skeleton"
import ChangeAvatarForm from "@/features/settings/profile/components/change-avatar-form"
import dynamic from "next/dynamic"

const ChangeNameForm = dynamic(
  () => import("@/features/settings/profile/components/change-name-form"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)
const ChangeEmailForm = dynamic(
  () => import("@/features/settings/profile/components/change-email-form"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)

export default function SettingsPage() {
  return (
    <>
      <SiteHeader label="Settings" />
      <MainPage>
        <ChangeAvatarForm />
        <QueryErrorBoundary>
          <ChangeNameForm />
        </QueryErrorBoundary>
        <QueryErrorBoundary>
          <ChangeEmailForm />
        </QueryErrorBoundary>
      </MainPage>
    </>
  )
}
