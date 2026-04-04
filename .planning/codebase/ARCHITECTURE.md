# Architecture

**Analysis Date:** 2026-04-04

## Pattern Overview

**Overall:** Modular layered monorepo with isolated backend API and frontend, using domain-driven module structure.

**Key Characteristics:**
- Clean separation of backend (Bun + Elysia) and frontend (Next.js 16)
- Domain-driven module organization (e.g., `/modules/category/`, `/features/category/`)
- Macro-based dependency injection for authentication across routes
- Prisma as single source of truth: schema → Prisma client + prismabox validators
- Type-first validation: Backend uses prismabox (auto-generated from Prisma), frontend uses Zod v4

## Layers

**API Presentation (Backend):**
- Purpose: HTTP request handling, route definitions, response formatting
- Location: `backend/src/modules/<name>/index.ts` (Elysia controllers)
- Contains: Route handlers with auth guards and body/query validation
- Depends on: Service layer, auth macro, prismabox schemas
- Used by: HTTP clients (frontend Axios, external tools)

**Business Logic (Backend):**
- Purpose: Core application logic, data validation, business rules enforcement
- Location: `backend/src/modules/<name>/service.ts` (static methods)
- Contains: CRUD operations, uniqueness checks, error handling
- Depends on: Prisma client, custom error classes
- Used by: Controllers

**Data Access (Backend):**
- Purpose: Database operations, query execution, transaction management
- Location: `backend/src/lib/prisma.ts` (Prisma client singleton)
- Contains: Prisma ORM configured with PostgreSQL adapter
- Depends on: PostgreSQL database, connection string from `.env`
- Used by: Service layer

**Authentication & Authorization (Backend):**
- Purpose: Session management, identity verification, route protection
- Location: `backend/src/lib/auth.ts` (Better Auth configuration), `backend/src/macros/auth.macro.ts` (Elysia macro)
- Contains: Better Auth setup with email/password + Google OAuth, emailOTP plugin
- Depends on: Prisma for user/session storage
- Used by: All protected controllers via `{ auth: true }` macro

**Validation (Backend):**
- Purpose: Type-safe request/response validation at HTTP layer
- Location: `backend/src/generated/prismabox/` (auto-generated), `backend/src/modules/<name>/query.ts` (manual)
- Contains: Typebox schemas auto-generated from Prisma models, custom query param schemas
- Depends on: Prisma schema (for prismabox), Elysia typebox
- Used by: Controllers for body and query validation

**Frontend Features:**
- Purpose: Domain-specific UI logic, forms, data fetching
- Location: `frontend/src/features/<name>/` (feature modules)
- Contains: Validation schemas, React components, TanStack React Form hooks, TanStack Query query options
- Depends on: Axios HTTP client, TanStack Query/React Form, shadcn/ui
- Used by: Next.js page routes

**Frontend Presentation:**
- Purpose: Page rendering, layout composition, routing
- Location: `frontend/src/app/` (Next.js App Router)
- Contains: Page components, layouts, auth flow pages
- Depends on: Feature modules, UI components, authentication client
- Used by: Browser

**Shared Infrastructure:**
- Purpose: HTTP client, authentication session management, styling utilities
- Location: `frontend/src/lib/api.ts` (Axios), `frontend/src/lib/auth-client.ts` (Better Auth client), `frontend/src/lib/utils.ts` (cn helper)
- Contains: Configured instances and utility functions
- Depends on: External libraries (axios, better-auth, clsx, tailwind-merge)
- Used by: All features and pages

## Data Flow

**Create Category (User interaction → API → DB):**

1. User fills form in `frontend/src/features/category/components/create-category-dialog.tsx`
2. Form validates using `categoryCreateSchema` (Zod v4) from `frontend/src/features/category/validations/schema.ts`
3. On submit, mutation calls `api.post("/api/category", data)` via TanStack Query
4. Backend route `POST /api/category` in `backend/src/modules/category/index.ts` receives request
5. Elysia validates body using `CategoryPlainInputCreate` (prismabox) from `backend/src/generated/prismabox/Category.ts`
6. Auth macro injects `user.id` from session via `backend/src/macros/auth.macro.ts`
7. `CategoryService.create(userId, validatedBody)` in `backend/src/modules/category/service.ts` executes:
   - Checks uniqueness via `prisma.category.findUnique({ where: { name_userId: { name, userId } } })`
   - Throws `Conflict` (409) if duplicate
   - Creates record via `prisma.category.create({ data: { ...input, userId } })`
   - Returns `status(201, createdCategory)`
8. Frontend mutation receives 201 response, invalidates `["categories", params]` cache, shows toast
9. Category list refetches via `getCategoriesQueryOptions` in `frontend/src/features/category/api/get-categories.query.ts`

**Session Management (Login → Auth middleware → Protected routes):**

1. User logs in via `authClient.signIn(email, password)` from `frontend/src/lib/auth-client.ts`
2. Better Auth processes credentials, creates session, sets cookies
3. All subsequent requests include session cookie (withCredentials: true in Axios)
4. Backend route checks session via auth macro: `auth.api.getSession({ headers })`
5. If valid, session and user injected into route handler; if invalid, 401 returned
6. Service layer always filters queries by `userId` to enforce data isolation

**Page Navigation (Auth state → Redirects):**

1. Root page `frontend/src/app/page.tsx` uses `authClient.useSession()`
2. Session state drives conditional rendering/redirects
3. Protected pages (dashboard) wrapped in session boundary (future implementation)
4. Auth pages (login, register) redirect to dashboard if session exists

## Key Abstractions

**Service Layer:**
- Purpose: Encapsulate business logic as static methods, separated from HTTP concerns
- Examples: `CategoryService` in `backend/src/modules/category/service.ts`, `AuthService` (in Better Auth)
- Pattern: Static class, all methods take `userId` as first param to enforce scoping

**Controller (Elysia Plugin):**
- Purpose: Define HTTP routes, handle auth guards, delegate to service
- Examples: `categoryController` in `backend/src/modules/category/index.ts`
- Pattern: Elysia plugin with `.use(authMacro)`, routes with `{ auth: true }` option

**Feature Module (Frontend):**
- Purpose: Colocate domain-specific UI, validation, API calls
- Examples: `frontend/src/features/category/`, `frontend/src/features/auth/`
- Pattern: Directory containing components/, hooks/, validations/, api/, types/

**Query/Mutation Options (TanStack Query):**
- Purpose: Type-safe, reusable data fetching configuration
- Examples: `getCategoriesQueryOptions` in `frontend/src/features/category/api/get-categories.query.ts`
- Pattern: Export `useQuery(getCategoriesQueryOptions(...))` from feature module

**Better Auth Session:**
- Purpose: Type-safe authentication state and methods
- Examples: `authClient.useSession()`, `authClient.signIn(...)` in `frontend/src/lib/auth-client.ts`
- Pattern: Singleton client instance configured in `backend/src/lib/auth.ts`

## Entry Points

**Backend API:**
- Location: `backend/src/index.ts`
- Triggers: `bun run dev` (Bun runtime)
- Responsibilities:
  - Configure Elysia app with CORS
  - Mount Better Auth routes at `/api/auth/*`
  - Mount all module controllers (category, etc.)
  - Listen on port 3030

**Frontend App:**
- Location: `frontend/src/app/layout.tsx` (root) and `frontend/src/app/page.tsx` (index)
- Triggers: `pnpm dev` (Next.js dev server)
- Responsibilities:
  - Root layout provides Providers (QueryClient, auth, tooltips, Nuqs)
  - Renders Toaster (Sonner)
  - Index page shows user greeting (authenticated redirect in progress)
  - Loads font families (Inter, Roboto, Geist)

**Auth Pages:**
- Location: `frontend/src/app/auth/login/page.tsx`, `/register/page.tsx`, `/verify-email/page.tsx`, `/forgot-password/page.tsx`, `/reset-password/page.tsx`
- Triggers: User navigates to `/auth/*`
- Responsibilities: Render auth forms, call `authClient` methods, redirect on success

**Dashboard Pages:**
- Location: `frontend/src/app/dashboard/(main)/page.tsx` (overview), `/dashboard/settings/page.tsx` (settings)
- Triggers: Authenticated user navigates to `/dashboard/*`
- Responsibilities: Show expense/income data, category management, user settings

## Error Handling

**Strategy:** Throw custom error classes with HTTP status codes; let framework convert to responses.

**Patterns:**

**Backend:**
- `NotFoundError(message)` from Elysia → 404 response
- `Conflict(message)` from `backend/src/global/error.ts` → 409 response
- Explicit `status(201, data)` for non-200 success responses
- Auth macro returns `status(401, { error: "Unauthorized" })` if no session

**Frontend:**
- TanStack Query captures error in `useQuery(..., { onError: (err) => ... })`
- Mutations show toast on error: `mutate(data, { onError: (err) => toast.error(err.message) })`
- Forms display field-level errors via TanStack React Form error API

## Cross-Cutting Concerns

**Logging:** 
- Backend: `console.log()` for OTP verification in auth config (production: replace with logger service)
- Frontend: TanStack Query Devtools in development (disabled by default)

**Validation:**
- Backend: Prismabox for request bodies (auto-generated), Typebox for query params
- Frontend: Zod v4 for form inputs, inferred DTOs from validation schemas

**Authentication:**
- Backend: Better Auth session + emailOTP plugin, stored in Prisma
- Frontend: Better Auth React client (`authClient`) with `useSession()` hook
- Mechanism: Cookies (withCredentials: true), checked on every protected route via macro

**Data Isolation:**
- Pattern: All queries filter by `userId`
- Enforcement: Service layer takes `userId` as first parameter
- Example: `prisma.category.findMany({ where: { userId, ... } })`

**CORS:**
- Configured in `backend/src/index.ts`: origin = `FRONTEND_URL`, credentials = true
- Allows frontend to send cookies with requests

**Styling:**
- Tailwind CSS 4 + shadcn/ui for components
- `cn()` helper (clsx + tailwind-merge) for class merging in `frontend/src/lib/utils.ts`
- Tailwind plugin sorts classes via Prettier

---

*Architecture analysis: 2026-04-04*
