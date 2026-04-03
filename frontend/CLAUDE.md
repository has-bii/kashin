# Frontend — Next.js 16 + React 19 + shadcn/ui

## Directory structure

```
src/features/<name>/
  components/             — React components (one per file)
  hooks/                  — TanStack React Form hooks (use-<action>.ts)
  validations/            — Zod v4 schemas (schema.ts) + inferred DTO types
  api/                    — TanStack Query options (<name>.query.ts)
  types/                  — TypeScript interfaces (index.ts)

src/app/
  auth/                   — Public auth pages (login, register, verify-email, etc.)
  dashboard/(main)/       — Authenticated main pages
  dashboard/settings/     — Settings pages (profile, authentication)

src/components/
  ui/                     — 30+ shadcn/ui primitives
  sidebar/                — App navigation components
  data-table.tsx          — Reusable data table

src/lib/
  api.ts                  — Axios HTTP client (base URL for backend)
  auth-client.ts          — Better Auth React client (useSession, signIn, signUp)
  utils.ts                — cn() helper (clsx + tailwind-merge)
```

## Key patterns

- **Validation**: Zod v4 (`import { z } from "zod/v4"`)
- **Queries**: TanStack Query `queryOptions()` — do NOT add staleTime/gcTime (set globally)
- **Forms**: TanStack React Form with Zod validator
- **Mutations**: `useMutation` with `toast` (sonner) for feedback
- **API calls**: Use `api` from `@/lib/api` (Axios instance)
- **No manual memo**: React Compiler handles memoization — never use React.memo/useMemo/useCallback
- **Package manager**: pnpm (never npm)

## Adding a feature

Use the **`frontend-feature`** skill. Reference implementation: `src/features/category/`
