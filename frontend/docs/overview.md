---
title: Project Overview
description: App purpose, tech stack, monorepo layout, environment setup, and key scripts
tags: [overview, setup, architecture]
---

# Project Overview

Kashin is a personal finance management app for Indonesian users. It tracks transactions, bank accounts, budgets, categories, and recurring transactions. It also supports Gmail-based email parsing to auto-extract financial transactions via AI.

## Monorepo Layout

```
kashin/
├── frontend/   # Next.js app (port 3000)
└── backend/    # Elysia + Bun API (port 3030)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router + React 19 |
| Language | TypeScript |
| Styling | Tailwind v4 (PostCSS) + shadcn/ui |
| State / fetching | TanStack React Query v5 |
| Forms | TanStack Form v1 + Zod v4 |
| Auth | Better Auth (email OTP + passkey) |
| URL state | nuqs |
| HTTP client | Axios (`withCredentials: true`) |
| Toasts | Sonner |
| Icons | Lucide React |
| Backend | Elysia + Bun |
| Database ORM | Prisma + PostgreSQL |
| AI | LangChain + OpenAI |
| Background jobs | Inngest + QStash |
| Email | Gmail API + Resend |

## Environment Setup

No `.env.example` — create `.env.local` manually:

```
COOKIE_PREFIX=__a_k
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3030/api
```

Only `NEXT_PUBLIC_*` vars are accessible client-side.

## Key Scripts

```bash
pnpm run dev        # Next.js dev server on port 3000
pnpm run build      # Production build
pnpm run lint       # ESLint
pnpm run test       # Vitest (run mode)
npx tsc --noEmit    # Type-check without emitting
```

## Auth Notes

- Better Auth with email OTP + passkey plugins
- Auth client `baseURL` must point to the API **root** (strip `/api`) — Better Auth manages its own routing
- Session cookies use prefix `__a_k` (set via `COOKIE_PREFIX`)

## Locale

- Timezone: `Asia/Jakarta`
- Locale: `id-ID`
- Currency: `IDR` (0 decimal places)
