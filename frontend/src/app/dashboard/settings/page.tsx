import { MainPage } from "@/components/sidebar/main-page"
import { SiteHeader } from "@/components/sidebar/site-header"
import ChangeAvatarForm from "@/features/settings/profile/components/change-avatar-form"
import ChangeCurrencyForm from "@/features/settings/profile/components/change-currency-form"
import ChangeEmailForm from "@/features/settings/profile/components/change-email-form"
import ChangeLocaleForm from "@/features/settings/profile/components/change-locale-form"
import ChangeNameForm from "@/features/settings/profile/components/change-name-form"
import ChangeTimezoneForm from "@/features/settings/profile/components/change-timezone-form"

export default function SettingsPage() {
  return (
    <>
      <SiteHeader label="Settings" />
      <MainPage>
        <ChangeAvatarForm />
        <ChangeNameForm />
        <ChangeEmailForm />
        <ChangeCurrencyForm />
        <ChangeLocaleForm />
        <ChangeTimezoneForm />
      </MainPage>
    </>
  )
}
