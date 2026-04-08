"use client"

import { MainPage } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import SettingFormSkeleton from "@/features/settings/components/setting-form-skeleton"
import dynamic from "next/dynamic"

const ChangeCurrencyForm = dynamic(
  () => import("@/features/settings/app/components/change-currency-form"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)
const ChangeTimezoneForm = dynamic(
  () => import("@/features/settings/app/components/change-timezone-form"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)
const ChangeLocaleForm = dynamic(
  () => import("@/features/settings/app/components/change-locale-form"),
  { ssr: false, loading: () => <SettingFormSkeleton /> },
)

export default function SettingsAppPage() {
  return (
    <>
      <SiteHeader label="Settings" />
      <MainPage>
        <ChangeCurrencyForm />
        <ChangeTimezoneForm />
        <ChangeLocaleForm />
      </MainPage>
    </>
  )
}
