"use client"

import SocialMethod from "./social-method"
import { getAccountListQueryOptions } from "../api/get-account-list.query"
import Google from "@/components/svgs/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"
import { Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

export default function SignInMethods() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const { data: accountList } = useQuery(getAccountListQueryOptions())

  const googleAccountId = accountList?.find((acc) => acc.providerId === "google")?.accountId

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign-in Methods</CardTitle>
        <CardDescription>
          Customize how you access your account. Link your Google account and set up passkeys for
          seamless, secure authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y rounded-2xl border">
          <Method
            name="Email"
            icon={<Mail />}
            value={session?.user.email}
            isLoading={isPending}
            manageAction={() => router.push("/dashboard/settings")}
          />
          <SocialMethod provider="google" icon={<Google />} accountId={googleAccountId} />
        </div>
      </CardContent>
    </Card>
  )
}

type MethodProps = {
  icon?: ReactNode
  name?: string
  value?: string
  manageAction: () => void
  isLoading: boolean
}

function Method({ name, icon, value, isLoading, manageAction }: MethodProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0">
      {icon}
      <div className="space-y-0">
        <h4 className="font-semibold capitalize">{name}</h4>
        <p className="text-muted-foreground text-sm">
          {isLoading ? "Loading..." : (value ?? `Connect to your ${name} account`)}
        </p>
      </div>
      <Button
        variant={value ? "secondary" : "default"}
        className="ml-auto"
        disabled={isLoading}
        onClick={manageAction}
      >
        {value ? "Manage" : "Connect"}
      </Button>
    </div>
  )
}
