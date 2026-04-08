import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth/minimal"
import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      currency: {
        type: "json",
        required: false,
        input: true,
        defaultValue: {
          code: "IDR",
          decimal: 0,
        },
      },
      timezone: {
        type: "string",
        required: false,
        defaultValue: "Asia/Jakarta",
        input: true,
      },
      locale: {
        type: "string",
        required: false,
        defaultValue: "id-ID",
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  cookieCache: {
    enabled: true,
    maxAge: 60 * 60, // 1 hour
    strategy: "compact",
  },
  advanced: {
    database: {
      generateId: false,
    },
    cookiePrefix: process.env.COOKIE_PREFIX,
  },
  trustedOrigins: [process.env.FRONTEND_URL!],
  plugins: [
    emailOTP({
      changeEmail: {
        enabled: true,
        verifyCurrentEmail: true,
      },
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[OTP] ${email}: ${otp} (${type})`)
      },
    }),
  ],
})
