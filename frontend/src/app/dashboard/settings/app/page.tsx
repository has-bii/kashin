"use client"

import { MainPage } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import SettingFormSkeleton from "@/features/settings/components/setting-form-skeleton"
import dynamic from "next/dynamic"

const AccessPermission = dynamic(
  () => import("@/features/settings/app/components/access-permission"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)

export default function SettingsAppPage() {
  return (
    <>
      <SiteHeader label="Application Settings" />
      <MainPage>
        <AccessPermission />
      </MainPage>
    </>
  )
}
