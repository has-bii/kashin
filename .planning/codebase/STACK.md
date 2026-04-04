# Technology Stack

**Analysis Date:** 2026-04-04

## Languages

**Primary:**
- TypeScript 5 (frontend), TypeScript 6 (backend) - Full-stack type safety

**Secondary:**
- SQL - PostgreSQL database queries via ORM

## Runtime

**Environment:**
- Bun (backend) - JavaScript runtime optimized for speed
- Node.js (frontend) - Next.js development and production

**Package Manager:**
- Backend: Bun package manager (with lockfile `bun.lockb`)
- Frontend: pnpm (with lockfile `pnpm-lock.yaml`)

## Frameworks

**Backend:**
- Elysia (latest) - Lightweight Bun-based API framework at `src/index.ts`
- Prisma 7 - ORM with PostgreSQL adapter at `backend/prisma/schema.prisma`

**Frontend:**
- Next.js 16.2.2 - App Router framework at `frontend/src/app/`
- React 19.2.4 - UI rendering with Compiler enabled in `next.config.ts`
- TanStack React Form 1.28.6 - Form state management with Zod validation
- TanStack React Query 5.96.1 - Server state with global QueryClient config
- TanStack React Table 8.21.3 - Data table primitives

**Styling:**
- Tailwind CSS 4 - Utility-first styling with PostCSS v4
- shadcn/ui 4.1.2 - Headless component library (30+ primitives in `src/components/ui/`)
- Class Variance Authority 0.7.1 - Component variant management
- Lucide React 1.7.0 - Icon library

**UI Components:**
- Radix UI 1.4.3 - Accessible primitives (integrated via shadcn)
- Recharts 3.8.0 - Data visualization
- Sonner 2.0.7 - Toast notifications
- Emoji Picker React 4.18.0 - Emoji selection
- Vaul 1.1.2 - Drawer/sheet components

**Drag and Drop:**
- @dnd-kit/core 6.3.1 - Headless drag-drop library
- @dnd-kit/sortable 10.0.0 - Sortable preset
- @dnd-kit/modifiers 9.0.0 - Drag modifiers
- @dnd-kit/utilities 3.2.2 - Helper utilities

**Testing:**
- Not yet configured (framework ready for Jest/Vitest)

## Key Dependencies

**Critical:**
- Better Auth 1.5.6 - Email/password + Google OAuth with Prisma adapter
- Prisma Client 7.6.0 - Database ORM with auto-generated types
- @prisma/adapter-pg 7.6.0 - PostgreSQL connection adapter
- pg 8.20.0 - Node PostgreSQL driver

**Validation:**
- Zod v4 (backend + frontend) - Schema validation and type inference
- prismabox 1.1.26 - Auto-generated Elysia validation schemas from Prisma models

**Frontend Data:**
- Axios 1.14.0 - HTTP client pointing to backend via `src/lib/api.ts`
- nuqs 2.8.9 - URL state management for query parameters
- next-themes 0.4.6 - Dark/light mode support

**Formatting & Linting:**
- Prettier 3.8.1 - Code formatter (both backend + frontend)
- @trivago/prettier-plugin-sort-imports 6.0.2 - Import sorting
- prettier-plugin-tailwindcss 0.7.2 - Tailwind class sorting (frontend only)
- ESLint 9 (frontend) - with eslint-config-next and @tanstack/eslint-plugin-query

**Compiler:**
- babel-plugin-react-compiler 1.0.0 - Automatic memoization for React 19

## Configuration

**Environment:**
- `.env.local` files for backend and frontend (secrets not committed)
- Backend: `DATABASE_URL`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `COOKIE_PREFIX`, `PORT`
- Frontend: API base URL pointing to `http://localhost:3030/api`

**TypeScript:**
- Backend: ESNext target, Node16 resolution, Bun types in `backend/tsconfig.json`
- Frontend: ES2017 target, bundler resolution, Next.js plugins in `frontend/tsconfig.json`

**Prettier:**
- Backend: `backend/.prettierrc` - import sorting, 100 char width, double quotes disabled
- Frontend: Tailwind class sorting enabled

**Next.js:**
- React Compiler: Enabled in `next.config.ts`
- Rewrites: `/auth` → `/auth/login`

**Prisma Generators:**
- Prisma Client: Output to `backend/src/generated/prisma/`
- Prismabox: Elysia validation schemas in `backend/src/generated/prismabox/`

## Platform Requirements

**Development:**
- Bun 1.3.11+ (backend runtime)
- Node.js (frontend tooling)
- PostgreSQL 18 (via Docker in `docker/postgres/docker-compose.yml`)

**Production:**
- Bun runtime (backend)
- Node.js runtime (frontend via Next.js)
- PostgreSQL 18+ database
- Port 3030 (backend Elysia), Port 3000 (frontend Next.js)

**Database:**
- PostgreSQL 18-alpine (containerized in Docker Compose)
- Connection pool: pg 8.20.0 driver
- Adapter: @prisma/adapter-pg for Prisma 7
- Volume: `docker/postgres/data/` for persistent storage

---

*Stack analysis: 2026-04-04*
