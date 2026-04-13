"use client"

import { getAccountListQueryOptions } from "../api/get-account-list.query"
import SocialMethodGoogle from "./social-method-google"
import { SocialMethodPasskey } from "./social-method-passkey"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function SignInMethods() {
  const { data: accountList } = useSuspenseQuery(getAccountListQueryOptions())

  const googleAccountId = accountList.find((acc) => acc.providerId === "google")?.accountId

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
          {/* Google */}
          <SocialMethodGoogle accountId={googleAccountId!} />

          {/* Passkey */}
          <SocialMethodPasskey />
        </div>
      </CardContent>
    </Card>
  )
}
