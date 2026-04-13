import { getAccountInfoQueryOptions } from "../api/get-account-info.query"
import { SocialMethodContent, SocialMethodIcon, SocialMethodItem } from "./social-method"
import Google from "@/components/svgs/google"
import { useSuspenseQuery } from "@tanstack/react-query"

type Props = {
  accountId: string
}

export default function SocialMethodGoogle({ accountId }: Props) {
  const { data } = useSuspenseQuery(getAccountInfoQueryOptions(accountId))

  return (
    <SocialMethodItem>
      <SocialMethodIcon>
        <Google />
      </SocialMethodIcon>
      <SocialMethodContent
        title="Google"
        description={data.user.email || "Google account not found"}
      />
    </SocialMethodItem>
  )
}
