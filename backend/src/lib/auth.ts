import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth/minimal"
import { emailOTP, openAPI } from "better-auth/plugins"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
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
    useSecureCookies: true,
  },
  rateLimit: {
    enabled: true,
    window: 15 * 60, // 15 minutes in seconds
    max: 10, // 10 requests per 15 minutes for auth endpoints
  },
  trustedOrigins: [process.env.FRONTEND_URL!],
  plugins: [
    openAPI(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[OTP] ${email}: ${otp} (${type})`)
      },
    }),
  ],
})
