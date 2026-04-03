# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kashin is a full-stack expense/income tracker with AI-powered email receipt processing. Users can manually manage transactions or forward receipt emails for automatic AI extraction.

## Architecture

Two separate packages (not a monorepo — no shared workspaces). Each package has its own `CLAUDE.md` with detailed file maps and patterns:

- **`backend/`** — Bun + Elysia framework, Prisma 7 ORM, TiDB Cloud (MySQL serverless), Better Auth
- **`frontend/`** — Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, TanStack React Form

### Auth flow
Better Auth handles email/password + Google OAuth. Backend proxies all auth at `/api/auth/*`. Sessions use secure HTTP-only cookies. Frontend uses `better-auth/react` client hooks.

### API conventions
- Base path: `/api`, port 3030
- CORS configured for frontend origin
- Rate limiting on auth endpoints (10 req / 15 min)

### Database models (Prisma, `relationMode = "prisma"`)
- **Auth**: User, Session, Account, Verification
- **App core**: Category, Transaction, RecurringTransaction
- **Email/AI**: EmailInbox, EmailLog, AiExtraction, Attachment
- **System**: DefaultCategory
- **Enums**: TransactionType (expense/income), TransactionSource (manual/email/recurring), EmailLogStatus, AiExtractionStatus, RecurringFrequency

## Commands

### Backend
```bash
cd backend
bun install
bun run dev          # Dev server with watch mode (port 3030)
bunx prisma generate # Regenerate Prisma client after schema changes
bunx prisma db push  # Push schema to database
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev             # Dev server (port 3000)
pnpm build           # Production build
pnpm lint            # ESLint
```

## Key conventions

- **ID strategy**: UUID v7 for user-facing tables, BigInt auto-increment for internal tables
- **Database adapter**: TiDB Cloud serverless via `@tidbcloud/prisma-adapter` — not standard MySQL driver
- **Validation**: Zod schemas in `validations/` directories, integrated with TanStack React Form
- **Styling**: Tailwind CSS 4 + shadcn/ui (uses `class-variance-authority` for variants, `tailwind-merge` + `clsx` via `cn()` utility)
- **Formatting**: Prettier with import sorting and Tailwind class sorting plugins
