import MainPage from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import ChangeAvatarForm from "@/features/settings/profile/components/change-avatar-form"
import ChangeEmailForm from "@/features/settings/profile/components/change-email-form"
import ChangeNameForm from "@/features/settings/profile/components/change-name-form"

export default function SettingsPage() {
  return (
    <>
      <SiteHeader label="Settings" />
      <MainPage>
        <ChangeAvatarForm />
        <ChangeNameForm />
        <ChangeEmailForm />
      </MainPage>
    </>
  )
}
