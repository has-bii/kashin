import { sendPasswordResetEmail, sendVerificationOtp, sendWelcomeEmail } from "./email"
import { prisma } from "./prisma"
import { passkey } from "@better-auth/passkey"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth/minimal"
import { emailOTP } from "better-auth/plugins"
import { ENV } from "../config/env"

export const auth = betterAuth({
  appName: "Kashin",
  baseURL: ENV.AUTH.betterAuthUrl,
  secret: ENV.AUTH.betterAuthSecret,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    // eslint-disable-next-line @typescript-eslint/require-await
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail(user.email, url)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: ENV.AUTH.googleClientId,
      clientSecret: ENV.AUTH.googleClientSecret,
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
    cookiePrefix: ENV.AUTH.cookiePrefix,
    crossSubDomainCookies: {
      enabled: true,
      domain: ENV.AUTH.domain,
    },
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
          void sendWelcomeEmail(user.email, user.name)
        },
      },
    },
  },
  trustedOrigins: [ENV.AUTH.frontendUrl],
  plugins: [
    emailOTP({
      changeEmail: {
        enabled: true,
        verifyCurrentEmail: true,
      },
      overrideDefaultEmailVerification: true,
      // eslint-disable-next-line @typescript-eslint/require-await
      sendVerificationOTP: async ({ email, otp, type }) => {
        void sendVerificationOtp(email, otp, type)
      },
    }),
    passkey({
      registration: {
        requireSession: true,
      },
      rpID: new URL(ENV.AUTH.frontendUrl).hostname,
      rpName: "Kashin",
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "required",
      },
      advanced: {
        webAuthnChallengeCookie: `${ENV.AUTH.cookiePrefix}_pk_challenge`,
      },
    }),
  ],
})
