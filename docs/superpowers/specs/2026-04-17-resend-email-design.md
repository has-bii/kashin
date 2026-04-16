# Resend Email Service — Design Spec

## Context

Kashin needs transactional email sending for user authentication flows. Currently, `auth.ts` logs OTPs to the console instead of sending real emails. No email sending infrastructure exists in the backend.

## Approach

Shared lib utility at `backend/src/lib/email.ts` — matches existing patterns (`llm.ts`, `qstash.ts`). No new modules or routes needed since all emails are triggered internally by auth events.

## Changes

### 1. Install dependency

```bash
cd backend && bun add resend
```

### 2. New file: `backend/src/lib/email.ts`

- Initialize `Resend` client with `RESEND_API_KEY` env var
- Export `resend` instance (matches pattern of `llm.ts`, `qstash.ts`)
- Helper functions:
  - `sendVerificationOtp(email: string, otp: string)` — plain text + HTML email with OTP code
  - `sendWelcomeEmail(email: string, name: string | null)` — welcome message after sign-up
  - `sendPasswordResetEmail(email: string, resetUrl: string)` — password reset link
- Sender address from `EMAIL_FROM` env var
- Use `logger` from `./logger` for error logging

### 3. Modify: `backend/src/lib/auth.ts`

- Import `sendVerificationOtp` from `./email`
- Replace `sendVerificationOTP` callback body (currently `logger.info(...)`) with call to `sendVerificationOtp(email, otp)`
- Add welcome email send in `user.create.after` hook, after `userSettings.create`

### 4. Environment variables

Add to `.env.local`:
```
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@yourdomain.com
```

`EMAIL_FROM` — configurable sender address per environment.

## Verification

1. Add `RESEND_API_KEY` and `EMAIL_FROM` to `.env.local`
2. Run `bun run dev` — server should start without errors
3. Trigger sign-up flow — check Resend dashboard for sent emails
4. Verify OTP email arrives with correct code
5. Verify welcome email sends after user creation
6. Check logs for any send errors (logged via pino, not thrown)
