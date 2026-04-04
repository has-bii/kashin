# Codebase Structure

**Analysis Date:** 2026-04-04

## Directory Layout

```
kashin/
├── backend/                                    # Bun + Elysia API server
│   ├── src/
│   │   ├── index.ts                           # Elysia app entry, mounts all modules
│   │   ├── lib/
│   │   │   ├── auth.ts                        # Better Auth config
│   │   │   └── prisma.ts                      # Prisma client singleton
│   │   ├── macros/
│   │   │   └── auth.macro.ts                  # { auth: true } dependency injection
│   │   ├── global/
│   │   │   └── error.ts                       # Custom HTTP error classes
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   └── index.ts                   # Better Auth routes
│   │   │   └── category/
│   │   │       ├── index.ts                   # Controller (routes)
│   │   │       ├── service.ts                 # Business logic
│   │   │       └── query.ts                   # Query param schemas
│   │   └── generated/
│   │       ├── prisma/                        # Auto-generated Prisma client
│   │       └── prismabox/                     # Auto-generated Elysia validators
│   ├── prisma/
│   │   ├── schema.prisma                      # Database schema (PostgreSQL)
│   │   └── migrations/                        # Migration history
│   ├── CLAUDE.md                              # Backend module guide
│   └── package.json                           # Bun dependencies
│
├── frontend/                                   # Next.js 16 + React 19 client
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                     # Root layout (fonts, providers, toaster)
│   │   │   ├── page.tsx                       # Index page (redirect logic)
│   │   │   ├── globals.css                    # Tailwind + global styles
│   │   │   ├── auth/
│   │   │   │   ├── layout.tsx                 # Auth layout
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   ├── verify-email/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   └── reset-password/page.tsx
│   │   │   └── dashboard/
│   │   │       ├── (main)/
│   │   │       │   ├── page.tsx               # Dashboard overview
│   │   │       │   └── category/page.tsx      # Category management
│   │   │       └── settings/
│   │   │           ├── page.tsx               # Settings overview
│   │   │           └── authentication/page.tsx # Auth settings (email change, etc.)
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   ├── login-form.tsx
│   │   │   │   │   ├── register-form.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-login.ts
│   │   │   │   │   ├── use-register.ts
│   │   │   │   │   └── ...
│   │   │   │   └── validations/
│   │   │   │       └── schema.ts
│   │   │   │
│   │   │   ├── category/
│   │   │   │   ├── components/
│   │   │   │   │   ├── category-list.tsx
│   │   │   │   │   ├── create-category-dialog.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-create-category.ts
│   │   │   │   │   ├── use-update-category.ts
│   │   │   │   │   └── use-delete-category.ts
│   │   │   │   ├── api/
│   │   │   │   │   └── get-categories.query.ts # TanStack Query options
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts               # TypeScript interfaces
│   │   │   │   └── validations/
│   │   │   │       └── schema.ts              # Zod schemas
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── authentication/
│   │   │       │   ├── components/
│   │   │       │   ├── hooks/
│   │   │       │   ├── api/
│   │   │       │   ├── types/
│   │   │       │   └── validations/
│   │   │       └── profile/
│   │   │           ├── components/
│   │   │           ├── hooks/
│   │   │           ├── api/
│   │   │           ├── types/
│   │   │           └── validations/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   └── ... (shadcn/ui primitives)
│   │   │   ├── sidebar/
│   │   │   │   ├── nav.tsx
│   │   │   │   ├── user-nav.tsx
│   │   │   │   └── ...
│   │   │   ├── svgs/
│   │   │   │   ├── icon-category.tsx
│   │   │   │   └── ...
│   │   │   └── data-table.tsx                 # Reusable table component
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                         # Axios client (base URL, credentials)
│   │   │   ├── auth-client.ts                 # Better Auth React client
│   │   │   ├── utils.ts                       # cn() helper
│   │   │   └── types.ts                       # Shared types
│   │   │
│   │   ├── providers/
│   │   │   └── index.tsx                      # QueryClient, auth, tooltips, Nuqs
│   │   │
│   │   ├── hooks/
│   │   │   └── ...                            # Global hooks
│   │   │
│   │   ├── constants/
│   │   │   └── ...                            # App constants
│   │   │
│   │   ├── types/
│   │   │   ├── enums.ts                       # TransactionType, etc.
│   │   │   └── index.ts                       # Global types
│   │   │
│   │   └── public/
│   │       ├── images/
│   │       └── ...
│   │
│   ├── CLAUDE.md                              # Frontend module guide
│   └── package.json                           # pnpm dependencies
│
├── docker/
│   └── postgres/                              # PostgreSQL Docker setup
│       └── data/                              # Volume mount
│
├── .planning/
│   └── codebase/                              # GSD planning documents
│       ├── ARCHITECTURE.md
│       └── STRUCTURE.md
│
├── CLAUDE.md                                  # Project overview
├── docker-compose.yml                         # Local dev PostgreSQL
└── .gitignore
```

## Directory Purposes

**`backend/src/index.ts`:**
- Purpose: Elysia app entry point
- Contains: CORS config, route mounting, server startup
- Imports: All module controllers

**`backend/src/lib/`:**
- Purpose: Singleton instances and configuration
- `auth.ts`: Better Auth setup with email/password, Google OAuth, emailOTP
- `prisma.ts`: Prisma client with PostgreSQL adapter (PrismaPg)

**`backend/src/macros/`:**
- Purpose: Elysia macros for dependency injection
- `auth.macro.ts`: Injects `{ user, session }` into routes via `{ auth: true }` option

**`backend/src/global/`:**
- Purpose: Application-wide error classes
- `error.ts`: Custom error classes (Conflict 409, others via Elysia)

**`backend/src/modules/<name>/`:**
- Purpose: Domain-specific API module (controller + service)
- `index.ts`: Elysia controller (routes, validation, auth guards)
- `service.ts`: Business logic (static methods, database operations)
- `query.ts`: Query parameter schemas (optional, for GET endpoints)

**`backend/src/generated/`:**
- Purpose: Auto-generated code (DO NOT EDIT)
- `prisma/`: Prisma client from schema
- `prismabox/`: Elysia validators from schema (run `bunx --bun prisma generate`)

**`backend/prisma/`:**
- Purpose: Database schema and migrations
- `schema.prisma`: Single source of truth for Prisma client + prismabox validators
- `migrations/`: Versioned schema changes (managed by Prisma)

**`frontend/src/app/`:**
- Purpose: Next.js App Router pages and layouts
- Structure: File-based routing, (groups) for layout nesting
- `auth/`: Public authentication pages
- `dashboard/(main)/`: Authenticated feature pages
- `dashboard/settings/`: User settings pages
- `layout.tsx`: Root layout with providers and fonts
- `page.tsx`: Index page (redirects or onboarding)

**`frontend/src/features/<name>/`:**
- Purpose: Domain-specific feature module
- `components/`: React components (one file per component)
- `hooks/`: TanStack React Form hooks (use-*.ts)
- `validations/`: Zod schemas + inferred DTO types (schema.ts)
- `api/`: TanStack Query query/mutation options (*-query.ts, *-mutation.ts)
- `types/`: TypeScript interfaces (index.ts)
- Pattern: Feature module is self-contained; import into pages

**`frontend/src/components/`:**
- Purpose: Reusable UI components, not feature-specific
- `ui/`: shadcn/ui primitives (30+ components)
- `sidebar/`: Navigation and layout components
- `svgs/`: Icon components
- `data-table.tsx`: Generic table component with sorting, filtering

**`frontend/src/lib/`:**
- Purpose: Shared utilities and instances
- `api.ts`: Axios instance (base URL, timeout, credentials)
- `auth-client.ts`: Better Auth React client (useSession, signIn, etc.)
- `utils.ts`: Helper functions (cn utility for class merging)

**`frontend/src/providers/`:**
- Purpose: Application context providers
- `index.tsx`: QueryClient setup (staleTime 1min, gcTime 5min), TooltipProvider, NuqsAdapter, Devtools

## Key File Locations

**Entry Points:**
- Backend API: `backend/src/index.ts` (Elysia app, runs on port 3030)
- Frontend: `frontend/src/app/layout.tsx` (root layout), `frontend/src/app/page.tsx` (index)

**Configuration:**
- Backend: `backend/CLAUDE.md` (patterns and directory map), `.env` (DATABASE_URL, FRONTEND_URL, etc.)
- Frontend: `frontend/CLAUDE.md` (patterns and directory map), `next.config.js` (if present)
- Database: `backend/prisma/schema.prisma` (all models, enums, relationships)
- Environment: `docker-compose.yml` (PostgreSQL setup)

**Core Logic:**
- Category API: `backend/src/modules/category/index.ts` (routes), `service.ts` (business logic)
- Category UI: `frontend/src/features/category/components/` (forms, lists), `hooks/` (mutations), `api/` (queries)
- Auth: `backend/src/lib/auth.ts` (Better Auth), `frontend/src/lib/auth-client.ts` (React client)

**Testing:**
- Not yet implemented (no test files found)

**Generated Code:**
- `backend/src/generated/prisma/` — Prisma client (regenerate: `bunx --bun prisma generate`)
- `backend/src/generated/prismabox/` — Elysia validators (regenerate: `bunx --bun prisma generate`)

## Naming Conventions

**Files:**

- Backend controllers: `index.ts` (exports named controller)
- Backend services: `service.ts` (exports named `XService` class)
- Backend query schemas: `query.ts` (exports named `getQuery`, `listQuery`, etc.)
- Frontend components: PascalCase (e.g., `CategoryList.tsx`, `CreateCategoryDialog.tsx`)
- Frontend hooks: camelCase with `use` prefix (e.g., `useCreateCategory.ts`)
- Frontend validation: `schema.ts` (exports named schemas)
- Frontend API: `<action>-query.ts` for TanStack Query options, `<action>-mutation.ts` for mutations

**Directories:**

- Backend modules: lowercase (e.g., `modules/category/`)
- Frontend features: lowercase (e.g., `features/category/`)
- UI component subdirs: `components/`, `hooks/`, `api/`, `types/`, `validations/`
- Utilities: `lib/`, `utils/`, `constants/`, `types/`

**Exports:**

- Controllers: Default or named `const categoryController = new Elysia(...)`
- Services: Named class `export abstract class CategoryService { static ... }`
- Query options: Named `export const getCategoriesQueryOptions = (...) => queryOptions(...)`
- Schemas: Named `export const categoryCreateSchema = z.object(...)`

## Where to Add New Code

**New Backend API Endpoint:**
1. Add model to `backend/prisma/schema.prisma`
2. Run `bunx --bun prisma db push` to apply to database
3. Create `backend/src/modules/<name>/` directory
4. Implement:
   - `index.ts`: Elysia controller with routes (use `authMacro`)
   - `service.ts`: Static business logic methods (take `userId` as first param)
   - `query.ts`: Query param Typebox schemas (if needed)
5. Import controller in `backend/src/index.ts`: `.use(myController)`
6. Run `bunx --bun prisma generate` to generate Prisma client + prismabox validators

**Reference:** `backend/src/modules/category/` (complete example)

**New Frontend Feature:**
1. Create `frontend/src/features/<name>/` directory structure:
   - `components/` (React components)
   - `hooks/` (TanStack React Form hooks)
   - `validations/schema.ts` (Zod schemas)
   - `api/<action>-query.ts` (TanStack Query options)
   - `types/index.ts` (TypeScript interfaces)
2. Create validation schema in `validations/schema.ts`
3. Create form hook in `hooks/use-<action>.ts` (TanStack React Form + Zod)
4. Create query options in `api/<action>-query.ts` (TanStack Query)
5. Create components in `components/` (use hooks and mutations)
6. Create page in `frontend/src/app/dashboard/...` that imports components

**Reference:** `frontend/src/features/category/` (complete example)

**New UI Component:**
1. If shadcn/ui component: `npx shadcn-ui@latest add <component-name>`
2. If custom component: Add to `frontend/src/components/` (not in `ui/`)
3. Keep components single-responsibility and reusable

**New Utility or Helper:**
1. Shared across features: `frontend/src/lib/`
2. Feature-specific: `frontend/src/features/<name>/`
3. Global hooks: `frontend/src/hooks/`

## Special Directories

**`backend/src/generated/`:**
- Purpose: Auto-generated code
- Generated by: `bunx --bun prisma generate`
- Committed: Yes (include in git)
- Edit: Never — regenerate from schema

**`frontend/.next/`:**
- Purpose: Build cache and compiled output
- Generated by: `pnpm build` or `pnpm dev`
- Committed: No (in .gitignore)
- Delete: Safe to remove, rebuilds on next run

**`backend/prisma/migrations/`:**
- Purpose: Version history of schema changes
- Generated by: `bunx --bun prisma migrate dev`
- Committed: Yes
- Edit: Never — create new migration for changes

**`frontend/node_modules/`, `backend/node_modules/`:**
- Purpose: Dependencies
- Committed: No (in .gitignore)
- Install: `pnpm install` (frontend), `bun install` (backend)

**`docker/postgres/data/`:**
- Purpose: PostgreSQL volume mount
- Generated by: Docker Compose
- Committed: No (in .gitignore)
- Edit: Never — managed by PostgreSQL

---

*Structure analysis: 2026-04-04*
