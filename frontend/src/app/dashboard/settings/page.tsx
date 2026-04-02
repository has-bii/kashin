import MainPage from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import ChangeNameForm from "@/features/settings/profile/components/change-name-form"

export default function SettingsPage() {
  return (
    <>
      <SiteHeader label="Settings" />
      <MainPage>
        <ChangeNameForm />
      </MainPage>
    </>
  )
}
