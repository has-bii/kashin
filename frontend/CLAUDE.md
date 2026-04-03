@AGENTS.md

# Frontend — Next.js 16 + React 19 + shadcn/ui

## Feature module pattern

Each feature lives in `src/features/<name>/` with co-located directories:

```
src/features/<name>/
  components/     — React components (one per file, named <action>-form.tsx)
  hooks/          — TanStack React Form hooks (use-<action>-form.ts)
  validations/    — Zod v4 schemas (<action>.schema.ts), exports schema + inferred DTO type
  api/            — TanStack Query options (<name>.query.ts) using queryOptions()
```

### Validation pattern
```ts
import { z } from "zod/v4"
export const fooSchema = z.object({ ... })
export type FooDto = z.infer<typeof fooSchema>
```

### Query pattern
```ts
import { queryOptions } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
export const getFooQueryOptions = (id: string) => queryOptions({
  queryKey: ["foo", id],
  queryFn: async () => { ... }
})
```

## Feature modules

### `src/features/auth/`
- **Components**: login-form, register-form, verify-email-form, forgot-password-form, reset-password-form
- **Hooks**: use-register-form, use-forgot-password-form, use-verify-email-form
- **Validations**: login, register, verify-email, forgot-password, reset-password

### `src/features/settings/profile/`
- **Components**: change-avatar-form, change-email-form, change-name-form
- **Hooks**: use-change-email-form, use-change-name-form
- **Validations**: change-email, change-name

### `src/features/settings/authentication/`
- **Components**: oauth-error-handler, change-password-form, sign-in-methods, social-method
- **Hooks**: use-register-form
- **Validations**: change-password
- **API**: get-account-info.query, get-account-list.query

## Route structure

```
src/app/
  page.tsx                              — Home/landing page
  layout.tsx                            — Root layout
  auth/layout.tsx                       — Auth layout (public)
  auth/login/page.tsx
  auth/register/page.tsx
  auth/forgot-password/page.tsx
  auth/reset-password/page.tsx
  auth/verify-email/page.tsx
  dashboard/(main)/layout.tsx           — Main dashboard layout (authenticated)
  dashboard/(main)/page.tsx             — Dashboard home
  dashboard/settings/layout.tsx         — Settings layout
  dashboard/settings/page.tsx           — Profile settings
  dashboard/settings/authentication/    — Auth settings (password, OAuth)
```

## Shared components

- `src/components/ui/` — 30+ shadcn/ui primitives (button, card, dialog, input, select, tabs, table, sidebar, avatar, badge, alert, tooltip, etc.)
- `src/components/sidebar/` — app-sidebar, settings-sidebar, site-header, nav-main, nav-secondary, nav-user, main-page
- `src/components/svgs/` — SVG icon components (google.tsx)
- `src/components/data-table.tsx` — Reusable data table
- `src/components/section-cards.tsx` — Dashboard section cards
- `src/components/chart-area-interactive.tsx` — Dashboard chart

## Lib

- `src/lib/api.ts` — Axios HTTP client (base URL configured for backend)
- `src/lib/auth-client.ts` — Better Auth React client (provides `useSession`, `signIn`, `signUp`, etc.)
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

## Adding a new feature

1. Create `src/features/<name>/` with `components/`, `hooks/`, `validations/` dirs
2. Add Zod schemas in `validations/<action>.schema.ts` (import from `zod/v4`)
3. Create form hooks in `hooks/use-<action>-form.ts` using TanStack React Form
4. Build components in `components/<action>-form.tsx`
5. Add route page in `src/app/<route>/page.tsx`
6. For API data, create query options in `api/<name>.query.ts` using `queryOptions()`
