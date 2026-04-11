# Project Structure

## Repo Layout

- `backend/` — Elysia + Bun API
- `frontend/` — Next.js App Router
- `docker/` — Docker configuration
- `docs/` — Project documentation

## Backend Structure (`backend/src/`)

| What | Where | Example |
|------|-------|---------|
| New API module | `src/modules/<name>/` | `src/modules/budget/` |
| Module entry | `src/modules/<name>/index.ts` | exports controller |
| DB queries | `src/modules/<name>/query.ts` | Prisma calls |
| Business logic | `src/modules/<name>/service.ts` | validation, transforms |
| Shared DB client | `src/lib/prisma.ts` | import from here |
| Auth instance | `src/lib/auth.ts` | Better Auth setup |
| Global error types | `src/global/error.ts` | |
| Generated Prisma client | `src/generated/prisma/` | auto-generated |
| Generated TypeBox schemas | `src/generated/prismabox/` | auto-generated |

### Module Pattern

```
src/modules/<name>/
  index.ts     ← Elysia controller, mounts at /api/<name>
  query.ts     ← Prisma queries
  service.ts   ← Business logic, validation
```

Register in `src/index.ts` by importing and using `.use(controller)`.

## Frontend Structure (`frontend/src/`)

| What | Where | Example |
|------|-------|---------|
| New page | `src/app/<route>/page.tsx` | `src/app/dashboard/page.tsx` |
| New layout | `src/app/<route>/layout.tsx` | |
| Feature code | `src/features/<name>/` | `src/features/budget/` |
| Feature components | `src/features/<name>/components/` | kebab-case `.tsx` |
| Feature API calls | `src/features/<name>/api/` | `get-<name>.ts` |
| Feature hooks | `src/features/<name>/hooks/` | `use-<name>.ts` |
| Feature types | `src/features/<name>/types/` | |
| Feature validation | `src/features/<name>/validations/` | Zod schemas |
| Shared components | `src/components/` | not feature-specific |
| shadcn/ui primitives | `src/components/ui/` | |
| Global utilities | `src/lib/` | `utils.ts`, `api.ts` |
| Global hooks | `src/hooks/` | |
| Providers | `src/providers/` | |
| Constants | `src/constants/` | |
| Shared types | `src/types/` | |

### Feature Pattern

```
src/features/<name>/
  api/           ← axios calls, TanStack Query keys
  components/    ← kebab-case React components
  hooks/         ← use-<name>.ts custom hooks
  types/         ← TypeScript types for this feature
  validations/   ← Zod schemas
```

## Organization Pattern

Feature-based: both backend (modules) and frontend (features) are organized around domain entities (transaction, category, dashboard, settings, auth).
