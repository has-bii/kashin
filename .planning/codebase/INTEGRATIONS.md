# External Integrations

**Analysis Date:** 2026-04-04

## APIs & External Services

**Email Receipt Processing (Planned):**
- Email inboxes: Model `EmailInbox` in `backend/prisma/schema.prisma` (lines 198-211)
- AI extraction: Model `AiExtraction` for vendor/amount/date extraction (lines 213-239)
- Email logs: `EmailLog` model tracking received emails with status pipeline (lines 270-293)
- Infrastructure: Not yet integrated (schema-only, console logging for OTP in `backend/src/lib/auth.ts` line 57)

**Social Authentication:**
- Google OAuth - Integrated via Better Auth
  - SDK/Client: `better-auth` 1.5.6
  - Config: `backend/src/lib/auth.ts` lines 20-26
  - Env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Data Storage

**Databases:**
- PostgreSQL 18-alpine
  - Connection: `DATABASE_URL` environment variable
  - Adapter: `@prisma/adapter-pg` 7.6.0 for Prisma 7
  - Driver: `pg` 8.20.0 (Node PostgreSQL)
  - Config: `backend/src/lib/prisma.ts` lines 1-11

**File Storage:**
- Not yet integrated (schema supports attachments via `Attachment` model at lines 295+, fileUrl stored as string)

**Caching:**
- Frontend: TanStack Query v5 - Global config on QueryClient (staleTime/gcTime configured in root)
- Backend: None currently configured

## Authentication & Identity

**Auth Provider:**
- Better Auth 1.5.6 (self-hosted)
  - Implementation: Prisma adapter with PostgreSQL backend
  - Config: `backend/src/lib/auth.ts`
  - Provider models: `User`, `Session`, `Account`, `Verification` in schema (lines 66-139)

**Authentication Methods:**
- Email + Password: Enabled with email verification required
- Google OAuth: Configured with offline access
- Email OTP: Plugin for email verification and password change flows
  - Config: `backend/src/lib/auth.ts` lines 49-60
  - Change email: OTP verification enabled (line 51-53)

**Session Management:**
- Cookie-based with cache strategy: `compact` mode (1-hour max age)
- Rate limiting: 10 requests per 15 minutes on auth endpoints
- CORS: Trusted origins limited to `FRONTEND_URL`

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Console logging (development)
- OTP logging: `backend/src/lib/auth.ts` line 57 (console.log for testing)
- Email pipeline: `EmailLog.errorMessage` field in schema for tracking failures

## CI/CD & Deployment

**Hosting:**
- Not configured (local development only)

**CI Pipeline:**
- Not configured

**Local Development:**
- Docker Compose for PostgreSQL: `docker/postgres/docker-compose.yml`
- Backend: `bun run dev` (port 3030, watches `src/index.ts`)
- Frontend: `pnpm dev` (port 3000, Next.js dev server)

## Environment Configuration

**Required Backend Env Vars:**
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_URL` - Auth base URL (e.g., `http://localhost:3030`)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `FRONTEND_URL` - Frontend origin (CORS/trusted origins)
- `COOKIE_PREFIX` - Prefix for auth cookies (configured in `backend/src/lib/auth.ts` line 41)
- `PORT` - Backend server port (default: 3030)

**Required Frontend Env Vars:**
- Backend API base URL (for Axios in `src/lib/api.ts`)

**Secrets Location:**
- `.env.local` files (git-ignored, local development only)
- Backend: `/Users/hasbii/Desktop/projects/kashin/backend/.env.local`
- Frontend: `/Users/hasbii/Desktop/projects/kashin/frontend/.env.local`

## Webhooks & Callbacks

**Incoming:**
- Email webhooks: Infrastructure not yet integrated (schema prepared for email inboxes and logs)

**Outgoing:**
- None currently configured

## Database Schema Summary

**Auth Tables (Better Auth):**
- `users` - User profiles with UUID v7 IDs, currency/timezone defaults
- `sessions` - Session tokens with expiration
- `accounts` - OAuth account linking (Google)
- `verifications` - Email verification tokens

**User Data Tables (UUID v7):**
- `categories` - Expense/income categories with icons and colors
- `transactions` - Income/expense entries with sources (manual/email/recurring)
- `recurring_transactions` - Scheduled recurring transactions
- `email_inboxes` - User email addresses for receipt collection

**Processing Tables (BigInt auto-increment):**
- `email_logs` - Raw email receipt logs with processing status
- `ai_extractions` - Extracted receipt data (vendor, amount, date, confidence)
- `attachments` - Receipt files (URLs stored, actual files not yet integrated)

---

*Integration audit: 2026-04-04*
