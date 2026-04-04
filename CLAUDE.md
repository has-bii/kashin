# CLAUDE.md

## Project

Kashin — full-stack expense/income tracker with AI-powered email receipt processing.

## Architecture

- **`backend/`** — Bun + Elysia, Prisma 7 ORM, PostgreSQL via `@prisma/adapter-pg`, Better Auth
- **`frontend/`** — Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, TanStack React Form

Each package has its own `CLAUDE.md` with directory maps.

## Commands

```bash
# Backend (port 3030)
cd backend && bun install && bun run dev
bunx --bun prisma generate   # after schema changes
bunx --bun prisma db push    # push schema to DB

# Frontend (port 3000)
cd frontend && pnpm install && pnpm dev
```

## Key conventions

- **IDs**: UUID v7 for user-facing tables, BigInt auto-increment for internal
- **DB adapter**: PostgreSQL via `@prisma/adapter-pg`
- **FK enforcement**: Real foreign keys with `onDelete` cascade — always filter by `userId`
- **Validation**: Backend uses prismabox (auto-generated from Prisma). Frontend uses Zod v4
- **Styling**: Tailwind CSS 4 + shadcn/ui, `cn()` utility (clsx + tailwind-merge)
- **Formatting**: Prettier with import sorting + Tailwind class sorting

## Module registry

| Module   | Backend | Frontend | Status   |
| -------- | ------- | -------- | -------- |
| auth     | done    | done     | complete |
| category | done    | done     | complete |

## Skills

- **`backend-module`** — Use when creating a new backend API module
- **`frontend-feature`** — Use when creating a new frontend feature

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Kashin**

Kashin is a personal expense and income tracker for individuals. Users manually log transactions, organize them by category, and view spending summaries via a dashboard. Future versions add AI-powered email receipt extraction and paid subscriptions.

**Core Value:** A fast, frictionless way to log and visualize personal finances — before any AI automation, subscriptions, or mobile features exist.

### Constraints

- **Tech stack**: Bun + Elysia + Prisma + PostgreSQL (backend), Next.js + shadcn/ui (frontend) — established, do not deviate
- **Auth**: Better Auth is configured and integrated — do not swap
- **IDs**: UUID v7 for user-facing tables, BigInt auto-increment for internal tables
- **Data model**: Design transaction schema to accommodate v2 email extraction fields without migration pain
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5 (frontend), TypeScript 6 (backend) - Full-stack type safety
- SQL - PostgreSQL database queries via ORM
## Runtime
- Bun (backend) - JavaScript runtime optimized for speed
- Node.js (frontend) - Next.js development and production
- Backend: Bun package manager (with lockfile `bun.lockb`)
- Frontend: pnpm (with lockfile `pnpm-lock.yaml`)
## Frameworks
- Elysia (latest) - Lightweight Bun-based API framework at `src/index.ts`
- Prisma 7 - ORM with PostgreSQL adapter at `backend/prisma/schema.prisma`
- Next.js 16.2.2 - App Router framework at `frontend/src/app/`
- React 19.2.4 - UI rendering with Compiler enabled in `next.config.ts`
- TanStack React Form 1.28.6 - Form state management with Zod validation
- TanStack React Query 5.96.1 - Server state with global QueryClient config
- TanStack React Table 8.21.3 - Data table primitives
- Tailwind CSS 4 - Utility-first styling with PostCSS v4
- shadcn/ui 4.1.2 - Headless component library (30+ primitives in `src/components/ui/`)
- Class Variance Authority 0.7.1 - Component variant management
- Lucide React 1.7.0 - Icon library
- Radix UI 1.4.3 - Accessible primitives (integrated via shadcn)
- Recharts 3.8.0 - Data visualization
- Sonner 2.0.7 - Toast notifications
- Emoji Picker React 4.18.0 - Emoji selection
- Vaul 1.1.2 - Drawer/sheet components
- @dnd-kit/core 6.3.1 - Headless drag-drop library
- @dnd-kit/sortable 10.0.0 - Sortable preset
- @dnd-kit/modifiers 9.0.0 - Drag modifiers
- @dnd-kit/utilities 3.2.2 - Helper utilities
- Not yet configured (framework ready for Jest/Vitest)
## Key Dependencies
- Better Auth 1.5.6 - Email/password + Google OAuth with Prisma adapter
- Prisma Client 7.6.0 - Database ORM with auto-generated types
- @prisma/adapter-pg 7.6.0 - PostgreSQL connection adapter
- pg 8.20.0 - Node PostgreSQL driver
- Zod v4 (backend + frontend) - Schema validation and type inference
- prismabox 1.1.26 - Auto-generated Elysia validation schemas from Prisma models
- Axios 1.14.0 - HTTP client pointing to backend via `src/lib/api.ts`
- nuqs 2.8.9 - URL state management for query parameters
- next-themes 0.4.6 - Dark/light mode support
- Prettier 3.8.1 - Code formatter (both backend + frontend)
- @trivago/prettier-plugin-sort-imports 6.0.2 - Import sorting
- prettier-plugin-tailwindcss 0.7.2 - Tailwind class sorting (frontend only)
- ESLint 9 (frontend) - with eslint-config-next and @tanstack/eslint-plugin-query
- babel-plugin-react-compiler 1.0.0 - Automatic memoization for React 19
## Configuration
- `.env.local` files for backend and frontend (secrets not committed)
- Backend: `DATABASE_URL`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `COOKIE_PREFIX`, `PORT`
- Frontend: API base URL pointing to `http://localhost:3030/api`
- Backend: ESNext target, Node16 resolution, Bun types in `backend/tsconfig.json`
- Frontend: ES2017 target, bundler resolution, Next.js plugins in `frontend/tsconfig.json`
- Backend: `backend/.prettierrc` - import sorting, 100 char width, double quotes disabled
- Frontend: Tailwind class sorting enabled
- React Compiler: Enabled in `next.config.ts`
- Rewrites: `/auth` → `/auth/login`
- Prisma Client: Output to `backend/src/generated/prisma/`
- Prismabox: Elysia validation schemas in `backend/src/generated/prismabox/`
## Platform Requirements
- Bun 1.3.11+ (backend runtime)
- Node.js (frontend tooling)
- PostgreSQL 18 (via Docker in `docker/postgres/docker-compose.yml`)
- Bun runtime (backend)
- Node.js runtime (frontend via Next.js)
- PostgreSQL 18+ database
- Port 3030 (backend Elysia), Port 3000 (frontend Next.js)
- PostgreSQL 18-alpine (containerized in Docker Compose)
- Connection pool: pg 8.20.0 driver
- Adapter: @prisma/adapter-pg for Prisma 7
- Volume: `docker/postgres/data/` for persistent storage
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Controllers: `index.ts` (e.g., `src/modules/category/index.ts`)
- Services: `service.ts` (e.g., `src/modules/category/service.ts`)
- Query validators: `query.ts` (e.g., `src/modules/category/query.ts`)
- Validation schemas: `*.schema.ts` (e.g., `change-email.schema.ts`)
- Hooks: `use-<action>.ts` (e.g., `use-change-email-form.ts`)
- Query configs: `<name>.query.ts` (e.g., `get-account-list.query.ts`)
- Components: PascalCase `.tsx` (e.g., `CategoryCard.tsx`) or `change-avatar-form.tsx`
- Features: kebab-case directory names (e.g., `features/settings/profile/`)
- camelCase for regular functions: `getAll()`, `create()`, `update()`, `delete()`
- PascalCase for React components: `CategoryCard()`, `ChangeEmailForm()`
- Service methods: static methods in abstract classes: `CategoryService.create()`
- camelCase: `userId`, `newEmail`, `dialogStep`, `resendCooldown`
- Typed state variables with clear intent: `[dialogStep, setDialogStep]`, `[error, setError]`
- Private refs with suffix: `intervalRef`, `containerRef`
- DTOs/Inferred types: `CategoryCreateDto`, `ChangeEmailDto`
- Zod schemas: `categoryCreateSchema`, `changeEmailSchema`
- Enums: `DialogStep` ("idle" | "verify-current" | "verify-new")
- Type imports: `type Props`, `type Category`
## Code Style
- Prettier v3.8.1 with import sorting plugin
- Print width: 100 characters
- Semicolons: disabled (semi: false)
- Single quotes: disabled (singleQuote: false) — use double quotes
- Indentation: 2 spaces (Prettier default)
- ESLint 9 on frontend with Next.js config
- TanStack Query ESLint plugin enabled on frontend
- No backend linting configured
- Frontend: ESLint rule overrides: `react/no-children-prop: off`
- Backend: target: ESNext, module: nodenext, strict: true
- Frontend: target: ES2017, lib: [dom, dom.iterable, esnext], strict: true, incremental: true
- Both: forceConsistentCasingInFileNames: true, skipLibCheck: true
- Frontend-specific: jsx: react-jsx, isolatedModules: true, moduleResolution: bundler
## Import Organization
- Frontend: `@/*` → `./src/*`
- Backend: No path aliases configured; use relative imports
## Error Handling
- Custom error class: `Conflict` (409 status) in `src/global/error.ts`
- Elysia built-in: `NotFoundError` (404 status)
- Error throwing: `throw new Conflict("message")`, `throw new NotFoundError("message")`
- Status codes: `status(201, data)` for non-200 responses from Elysia
- Service methods should throw, controllers don't catch (Elysia handles)
- Try-catch with type checking: `if (err instanceof Error) { ... } else { ... }`
- Toast notifications: `toast.error()`, `toast.success()` via Sonner
- Error state in hooks: `[error, setError]` for form-level errors
- API errors: Check `error` field in response: `if (error) { setError(...) }`
- No global error boundary detected; errors managed per-feature
## Logging
- Startup logs: `console.log(\`🦊 Elysia is running at ...\`)`
- OTP logs: `console.log(\`[OTP] ${email}: ${otp} (${type})\`)` (clearly for development)
- No error logging framework in place; relies on exception throwing
- Use prefixes for log categories: `[OTP]`, etc.
- Log startups and critical operations
- No structured logging in place
## Comments
- Sparse commenting observed; code is mostly self-documenting
- Complex logic explained (e.g., "Check unique name" before DB query)
- Commented code is immediately above the operation it describes
- Not extensively used in codebase
- Type inference preferred; explicit JSDoc minimal
## Function Design
- Service methods: 5-40 lines (branching for checks, then operation)
- Controller handlers: 1-3 lines (delegate to service)
- Hooks: 50-160 lines (acceptable for stateful logic)
- Services: `(userId: string, input?: Type)` or `(userId: string, id: string, ...)`
- Controllers: Extract from context: `{ user, query, body, params }`
- Typed input: Use generated `CategoryPlainInputCreate` types from prismabox
- Services return Prisma results directly or wrapped in `status()`
- Controllers return service results (Elysia handles serialization)
- Hooks return object with multiple values: `{ form, otpForm, dialogStep, ... }`
## Module Design
- Controllers: `export const categoryController = new Elysia(...)`
- Services: `export abstract class CategoryService { static ... }`
- Validations: `export const categoryCreateSchema = z.object(...)`
- Inferred types: `export type CategoryCreateDto = z.infer<typeof categoryCreateSchema>`
- React components: `export function CategoryCard({ ... }) { ... }` or `export default function LoginPage() { ... }`
- Used in frontend for feature-level exports
- Not observed in backend
- Backend: Controllers are named exports to enable `.use()` in Elysia
- Frontend pages: Default exports (Next.js convention)
- Frontend features: Mixed (some default, some named)
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Clean separation of backend (Bun + Elysia) and frontend (Next.js 16)
- Domain-driven module organization (e.g., `/modules/category/`, `/features/category/`)
- Macro-based dependency injection for authentication across routes
- Prisma as single source of truth: schema → Prisma client + prismabox validators
- Type-first validation: Backend uses prismabox (auto-generated from Prisma), frontend uses Zod v4
## Layers
- Purpose: HTTP request handling, route definitions, response formatting
- Location: `backend/src/modules/<name>/index.ts` (Elysia controllers)
- Contains: Route handlers with auth guards and body/query validation
- Depends on: Service layer, auth macro, prismabox schemas
- Used by: HTTP clients (frontend Axios, external tools)
- Purpose: Core application logic, data validation, business rules enforcement
- Location: `backend/src/modules/<name>/service.ts` (static methods)
- Contains: CRUD operations, uniqueness checks, error handling
- Depends on: Prisma client, custom error classes
- Used by: Controllers
- Purpose: Database operations, query execution, transaction management
- Location: `backend/src/lib/prisma.ts` (Prisma client singleton)
- Contains: Prisma ORM configured with PostgreSQL adapter
- Depends on: PostgreSQL database, connection string from `.env`
- Used by: Service layer
- Purpose: Session management, identity verification, route protection
- Location: `backend/src/lib/auth.ts` (Better Auth configuration), `backend/src/macros/auth.macro.ts` (Elysia macro)
- Contains: Better Auth setup with email/password + Google OAuth, emailOTP plugin
- Depends on: Prisma for user/session storage
- Used by: All protected controllers via `{ auth: true }` macro
- Purpose: Type-safe request/response validation at HTTP layer
- Location: `backend/src/generated/prismabox/` (auto-generated), `backend/src/modules/<name>/query.ts` (manual)
- Contains: Typebox schemas auto-generated from Prisma models, custom query param schemas
- Depends on: Prisma schema (for prismabox), Elysia typebox
- Used by: Controllers for body and query validation
- Purpose: Domain-specific UI logic, forms, data fetching
- Location: `frontend/src/features/<name>/` (feature modules)
- Contains: Validation schemas, React components, TanStack React Form hooks, TanStack Query query options
- Depends on: Axios HTTP client, TanStack Query/React Form, shadcn/ui
- Used by: Next.js page routes
- Purpose: Page rendering, layout composition, routing
- Location: `frontend/src/app/` (Next.js App Router)
- Contains: Page components, layouts, auth flow pages
- Depends on: Feature modules, UI components, authentication client
- Used by: Browser
- Purpose: HTTP client, authentication session management, styling utilities
- Location: `frontend/src/lib/api.ts` (Axios), `frontend/src/lib/auth-client.ts` (Better Auth client), `frontend/src/lib/utils.ts` (cn helper)
- Contains: Configured instances and utility functions
- Depends on: External libraries (axios, better-auth, clsx, tailwind-merge)
- Used by: All features and pages
## Data Flow
## Key Abstractions
- Purpose: Encapsulate business logic as static methods, separated from HTTP concerns
- Examples: `CategoryService` in `backend/src/modules/category/service.ts`, `AuthService` (in Better Auth)
- Pattern: Static class, all methods take `userId` as first param to enforce scoping
- Purpose: Define HTTP routes, handle auth guards, delegate to service
- Examples: `categoryController` in `backend/src/modules/category/index.ts`
- Pattern: Elysia plugin with `.use(authMacro)`, routes with `{ auth: true }` option
- Purpose: Colocate domain-specific UI, validation, API calls
- Examples: `frontend/src/features/category/`, `frontend/src/features/auth/`
- Pattern: Directory containing components/, hooks/, validations/, api/, types/
- Purpose: Type-safe, reusable data fetching configuration
- Examples: `getCategoriesQueryOptions` in `frontend/src/features/category/api/get-categories.query.ts`
- Pattern: Export `useQuery(getCategoriesQueryOptions(...))` from feature module
- Purpose: Type-safe authentication state and methods
- Examples: `authClient.useSession()`, `authClient.signIn(...)` in `frontend/src/lib/auth-client.ts`
- Pattern: Singleton client instance configured in `backend/src/lib/auth.ts`
## Entry Points
- Location: `backend/src/index.ts`
- Triggers: `bun run dev` (Bun runtime)
- Responsibilities:
- Location: `frontend/src/app/layout.tsx` (root) and `frontend/src/app/page.tsx` (index)
- Triggers: `pnpm dev` (Next.js dev server)
- Responsibilities:
- Location: `frontend/src/app/auth/login/page.tsx`, `/register/page.tsx`, `/verify-email/page.tsx`, `/forgot-password/page.tsx`, `/reset-password/page.tsx`
- Triggers: User navigates to `/auth/*`
- Responsibilities: Render auth forms, call `authClient` methods, redirect on success
- Location: `frontend/src/app/dashboard/(main)/page.tsx` (overview), `/dashboard/settings/page.tsx` (settings)
- Triggers: Authenticated user navigates to `/dashboard/*`
- Responsibilities: Show expense/income data, category management, user settings
## Error Handling
- `NotFoundError(message)` from Elysia → 404 response
- `Conflict(message)` from `backend/src/global/error.ts` → 409 response
- Explicit `status(201, data)` for non-200 success responses
- Auth macro returns `status(401, { error: "Unauthorized" })` if no session
- TanStack Query captures error in `useQuery(..., { onError: (err) => ... })`
- Mutations show toast on error: `mutate(data, { onError: (err) => toast.error(err.message) })`
- Forms display field-level errors via TanStack React Form error API
## Cross-Cutting Concerns
- Backend: `console.log()` for OTP verification in auth config (production: replace with logger service)
- Frontend: TanStack Query Devtools in development (disabled by default)
- Backend: Prismabox for request bodies (auto-generated), Typebox for query params
- Frontend: Zod v4 for form inputs, inferred DTOs from validation schemas
- Backend: Better Auth session + emailOTP plugin, stored in Prisma
- Frontend: Better Auth React client (`authClient`) with `useSession()` hook
- Mechanism: Cookies (withCredentials: true), checked on every protected route via macro
- Pattern: All queries filter by `userId`
- Enforcement: Service layer takes `userId` as first parameter
- Example: `prisma.category.findMany({ where: { userId, ... } })`
- Configured in `backend/src/index.ts`: origin = `FRONTEND_URL`, credentials = true
- Allows frontend to send cookies with requests
- Tailwind CSS 4 + shadcn/ui for components
- `cn()` helper (clsx + tailwind-merge) for class merging in `frontend/src/lib/utils.ts`
- Tailwind plugin sorts classes via Prettier
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
