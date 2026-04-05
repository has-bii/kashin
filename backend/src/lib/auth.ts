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
        type: "string",
        required: false,
        defaultValue: "IDR",
        input: true,
      },
      timezone: {
        type: "string",
        required: false,
        defaultValue: "Asia/Jakarta",
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
  rateLimit: {
    enabled: true,
    window: 15 * 60, // 15 minutes in seconds
    max: 10, // 10 requests per 15 minutes for auth endpoints
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
