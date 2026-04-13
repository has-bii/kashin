"use client"

import { MainPage } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import ChangePasswordForm from "@/features/settings/authentication/components/change-password.form"
import OAuthErrorHandler from "@/features/settings/authentication/components/oauth-error-handler"
import SettingFormSkeleton from "@/features/settings/components/setting-form-skeleton"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const SignInMethods = dynamic(
  () => import("@/features/settings/authentication/components/sign-in-methods"),
  {
    ssr: false,
    loading: () => <SettingFormSkeleton />,
  },
)

export default function AuthenticationPage() {
  return (
    <>
      <SiteHeader label="Autentikasi" />
      <MainPage>
        <Suspense>
          <OAuthErrorHandler />
        </Suspense>
        <SignInMethods />
        <ChangePasswordForm />
      </MainPage>
    </>
  )
}
