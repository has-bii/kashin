---
title: Directory Structure
description: Full src/ tree with purpose per folder, app routes, feature module anatomy, lib singletons, and constants
tags: [directory, structure, navigation]
---

# Directory Structure

## Top-level `src/`

```
src/
├── app/            # Next.js App Router pages and layouts
├── features/       # Feature-based modules (primary business logic)
├── components/     # Shared UI components
├── lib/            # Singleton instances and clients
├── constants/      # Static data and config values
├── providers/      # React context providers
├── hooks/          # Global/shared custom hooks
├── types/          # Shared TypeScript enums and types
└── utils/          # Pure utility functions
```

## `app/` Routes

```
app/
├── auth/
│   ├── login/
│   ├── register/
│   ├── reset-password/
│   └── verify-email/
└── dashboard/
    ├── (main)/             # Route group (no layout segment in URL)
    │   ├── transactions/
    │   ├── bank-accounts/
    │   ├── category/
    │   ├── budget/
    │   ├── recurring-transactions/
    │   └── gmail/
    └── settings/
        ├── app/            # App-level settings
        └── authentication/ # Auth settings (passkeys, etc.)
```

## `features/` Modules

Each feature is fully self-contained:

```
features/<name>/
├── api/
│   ├── get-<name>.query.ts     # Read: queryOptions + queryKey factory
│   └── <action>-<name>.ts      # Write: standalone async mutation function
├── components/
│   └── <name>-form.tsx         # Forms, lists, cards, dialogs
├── hooks/
│   └── use-<name>-form.ts      # useForm + mutation wiring
├── types/
│   └── index.ts                # TypeScript interfaces and DTOs
└── validations/
    └── schema.ts               # Zod schema + inferred types
```

Current features: `auth`, `bank`, `bank-account`, `budget`, `category`, `dashboard`, `gmail`, `landing`, `recurring-transaction`, `settings`, `transaction`

## `components/`

```
components/
├── ui/         # shadcn/ui components (37 components — see @src/components/ui)
└── sidebar/    # Sidebar layout and navigation items
```

## `lib/` Singletons

| File | Purpose |
|------|---------|
| `api.ts` | Axios instance — `baseURL: NEXT_PUBLIC_API_URL`, `withCredentials: true`, 10s timeout, error normalization interceptor |
| `auth-client.ts` | Better Auth client — `baseURL` points to API root (no `/api` suffix) |
| `nuqs-parser.ts` | Type-safe nuqs parser helpers for URL query params |

## `constants/`

| File | Contents |
|------|---------|
| `indonesia.ts` | `TIMEZONE = "Asia/Jakarta"`, `LOCALE = "id-ID"`, `CURRENCY = "IDR"`, `DECIMAL = 0` |
| `category-colors.ts` | 8 color pairs (`{ bg: string, fg: string }`) for category color picker |

## `providers/`

Wraps the app with:
- TanStack Query client (`QueryClientProvider`)
- Tooltip provider
- nuqs adapter for Next.js App Router

## `types/`

Shared enums (e.g. transaction type, account type) used across multiple features.

## `utils/`

Pure utility functions: `format-amount.ts`, `format-date.ts`, etc.
