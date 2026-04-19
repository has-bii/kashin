# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev    # start Next.js dev server on port 3000
pnpm run build  # production build
pnpm run lint   # ESLint check
pnpm run test   # Vitest test runner
```

Type-check with `npx tsc --noEmit`. Backend runs on **port 3030**.

## Environment

No `.env.example` exists. Create `.env.local` manually:

```
COOKIE_PREFIX=__a_k
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3030/api
```

Only `NEXT_PUBLIC_*` vars are accessible client-side.

## Architecture

**Next.js 16 App Router + React 19** personal finance frontend.

### Directory structure

```
src/
├── app/                  # App Router pages
│   ├── auth/             # login, register, reset-password, verify-email
│   └── dashboard/
│       ├── (main)/       # transactions, bank-accounts, category, budget, recurring-transactions, gmail
│       └── settings/     # app settings, authentication settings
├── features/             # feature-based modules (see below)
├── components/
│   ├── ui/               # shadcn/ui components
│   └── sidebar/          # sidebar layout
├── lib/                  # singletons
├── constants/            # indonesia.ts, category-colors.ts
├── providers/            # React Query, Tooltip, Nuqs adapters
└── types/                # shared enums
```

### Feature module structure

Every feature in `src/features/<name>/` contains:
- `api/` — TanStack Query queries & mutations
- `components/` — feature-specific UI
- `hooks/` — `useXxxForm`, `useXxxQuery`, etc.
- `types/` — TypeScript interfaces
- `validations/` — Zod schemas

### Key lib singletons

- `src/lib/api.ts` — Axios instance (`baseURL: NEXT_PUBLIC_API_URL`, `withCredentials: true`, 10s timeout, error normalization interceptor)
- `src/lib/auth-client.ts` — Better Auth client; baseURL points to API root with `/api` suffix stripped
- `src/lib/nuqs-parser.ts` — type-safe query param helpers

### Authentication

Better Auth with email OTP + passkey plugins. The auth client baseURL must point to the root (not `/api`) — Better Auth handles its own path. Session cookies use prefix `__a_k`.

### Data fetching

TanStack React Query v5. Config: `staleTime: 1min`, `gcTime: 5min`, refetch on focus/reconnect, 1 retry on queries, 0 retries on mutations.

### URL state

`nuqs` manages type-safe URL query params — use `nuqs-parser.ts` helpers, not `useSearchParams` directly.

### UI

shadcn/ui components in `src/components/ui/`. Tailwind v4 (PostCSS). Dark mode via `next-themes`. Toast via Sonner.

## Gotchas

- **`withCredentials: true`** on Axios is required — cookie-based auth breaks without it
- **React Compiler** (Babel plugin) is active — avoid manual `useMemo`/`useCallback` where the compiler can handle it
- **Auth client baseURL** strips `/api` — pass the root URL, not the API prefix
- **nuqs** is tied to Next.js router — don't replace with raw `useSearchParams`
- Form validation uses **TanStack Form + Zod** together; keep Zod schemas in `validations/`

## Docs

@docs/overview.md
@docs/conventions.md
@docs/directory.md
@docs/styling.md
