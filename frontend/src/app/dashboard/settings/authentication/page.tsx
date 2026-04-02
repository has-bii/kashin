import MainPage from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import ChangePasswordForm from "@/features/settings/authentication/components/change-password.form"
import OAuthErrorHandler from "@/features/settings/authentication/components/oauth-error-handler"
import SignInMethods from "@/features/settings/authentication/components/sign-in-methods"
import { Suspense } from "react"

export default function AuthenticationPage() {
  return (
    <>
      <SiteHeader label="Authentication" />
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
