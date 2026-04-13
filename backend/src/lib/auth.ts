import { prisma } from "./prisma"
import { passkey } from "@better-auth/passkey"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth/minimal"
import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
  appName: "Kashin",
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.userSettings.create({
            data: {
              userId: user.id,
              filterEmailsByBank: false,
            },
          })
        },
      },
    },
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
    passkey({
      registration: {
        requireSession: true,
      },
      rpID: new URL(process.env.FRONTEND_URL!).hostname,
      rpName: "Kashin",
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "required",
      },
      advanced: {
        webAuthnChallengeCookie: `${process.env.COOKIE_PREFIX}_pk_challenge`,
      },
    }),
  ],
})
