import { emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!.replace("/api", ""),
  plugins: [emailOTPClient()],
})

// Extended user type that includes app-specific profile fields
// exposed via Better Auth additionalFields config on the backend
export type UserWithProfile = (typeof authClient.$Infer.Session.user) & {
  currency: string
  timezone: string
}
