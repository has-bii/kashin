import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!.replace("/api", ""),
  plugins: [
    emailOTPClient(),
    inferAdditionalFields({
      user: {
        currency: {
          type: "json",
          required: false,
          defaultValue: {
            code: "IDR",
            decimal: 0,
          },
        },
        timezone: {
          type: "string",
          required: false,
          defaultValue: "Asia/Jakarta",
        },
        locale: {
          type: "string",
          required: false,
          defaultValue: "id-ID",
        },
      },
    }),
  ],
})

// Extended user type that includes app-specific profile fields
// exposed via Better Auth additionalFields config on the backend
export type UserProfile = typeof authClient.$Infer.Session.user & {
  currency: {
    code: string
    decimal: number
  }
  timezone: string
  locale: string
}
