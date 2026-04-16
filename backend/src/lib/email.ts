import { logger } from "./logger"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? "Kashin <noreply@kashin.app>"

async function send({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject,
    html,
    text,
  })

  if (error) {
    logger.error({ error, to, subject }, "Failed to send email")
    return
  }

  logger.info({ emailId: data?.id, to, subject }, "Email sent")
}

const otpEmailConfig: Record<
  "sign-in" | "email-verification" | "forget-password" | "change-email",
  { subject: string; body: string }
> = {
  "sign-in": {
    subject: "Your Kashin sign-in code",
    body: "Use this code to sign in to your account",
  },
  "email-verification": {
    subject: "Verify your email for Kashin",
    body: "Use this code to verify your email address",
  },
  "forget-password": {
    subject: "Your Kashin password reset code",
    body: "Use this code to reset your password",
  },
  "change-email": {
    subject: "Confirm your new email for Kashin",
    body: "Use this code to confirm your new email address",
  },
}

export async function sendVerificationOtp(
  email: string,
  otp: string,
  type: keyof typeof otpEmailConfig,
) {
  const { subject, body } = otpEmailConfig[type]

  await send({
    to: email,
    subject,
    html: `<p>${body}:</p><p><strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
    text: `${body}: ${otp}. This code expires in 10 minutes.`,
  })
}

export async function sendWelcomeEmail(email: string, name: string | null) {
  const greeting = name ? `Hi ${name}` : "Welcome"

  await send({
    to: email,
    subject: "Welcome to Kashin!",
    html: `<p>${greeting},</p><p>Thanks for signing up for Kashin. You're all set to start tracking your expenses.</p>`,
    text: `${greeting},\n\nThanks for signing up for Kashin. You're all set to start tracking your expenses.`,
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await send({
    to: email,
    subject: "Reset your Kashin password",
    html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
    text: `Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
  })
}
