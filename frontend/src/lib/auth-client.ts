import { passkeyClient } from "@better-auth/passkey/client"
import { emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!.replace("/api", ""),
  plugins: [emailOTPClient(), passkeyClient()],
})

export type UserProfile = typeof authClient.$Infer.Session.user
