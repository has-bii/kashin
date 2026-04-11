# Tech Stack

## Backend

- **Framework:** Elysia (latest) — Bun-native HTTP framework with built-in TypeBox/Zod validation
- **Runtime:** Bun
- **Language:** TypeScript 6.x (strict, ESNext target)
- **Database:** PostgreSQL via Prisma 7.x (with `@prisma/adapter-pg` + TiDB Cloud adapter)
- **ORM:** Prisma 7 — schema in `prisma/schema.prisma`, client output at `src/generated/prisma`
- **Auth:** Better Auth 1.5.x (session-based, email/password)
- **Validation:** Zod 4.x + Prismabox (auto-generates Elysia TypeBox schemas from Prisma models)
- **Rate Limiting:** `elysia-rate-limit` (100 req/60s)

## Frontend

- **Framework:** Next.js 16.2 (App Router)
- **Runtime:** Node.js (pnpm managed)
- **Language:** TypeScript 5.x (strict)
- **UI Library:** shadcn/ui (radix-luma style, olive base color, CSS variables)
- **Component Primitives:** `radix-ui`
- **Styling:** Tailwind CSS 4.x (PostCSS plugin, CSS variables)
- **Icons:** `lucide-react`
- **Server State:** TanStack Query 5.x
- **Forms:** TanStack Form 1.x
- **Tables:** TanStack Table 8.x
- **Auth Client:** Better Auth 1.6.x (`src/lib/auth-client.ts`)
- **HTTP Client:** axios (configured at `src/lib/api.ts`)
- **URL State:** nuqs 2.x
- **Dates:** date-fns 4.x + `@date-fns/tz`
- **Charts:** recharts 3.x
- **Drag & Drop:** @dnd-kit (core + sortable + modifiers)
- **Toasts:** sonner
- **Drawers/Dialogs:** vaul (mobile-friendly drawers)
- **Themes:** next-themes

## Key Decisions

- React Compiler active (`babel-plugin-react-compiler`) — no manual memoization
- Indonesia locale hardcoded — no timezone/locale/currency user settings
- Prismabox generates Elysia validation schemas from Prisma models directly
- TiDB Cloud adapter available for serverless DB connections
- staleTime/gcTime set on root QueryClient — never add per-query overrides
