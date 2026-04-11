# Dependencies

## Use These Libraries (do NOT substitute)

### Backend

| Purpose | Library | Import From |
|---|---|---|
| HTTP framework | `elysia` | `elysia` |
| Validation schemas | `zod` | `zod` |
| Prisma-to-Elysia schemas | `prismabox` (generated) | `@/generated/prismabox` |
| Auth server | `better-auth` | `better-auth` |
| CORS | `@elysiajs/cors` | `@elysiajs/cors` |
| Rate limiting | `elysia-rate-limit` | `elysia-rate-limit` |
| DB client | `@prisma/client` (generated) | `@/generated/prisma` |

### Frontend

| Purpose | Library | Import From |
|---|---|---|
| HTTP requests | `axios` (configured instance) | `@/lib/api` |
| Server state | `@tanstack/react-query` | `@tanstack/react-query` |
| Forms | `@tanstack/react-form` | `@tanstack/react-form` |
| Tables | `@tanstack/react-table` | `@tanstack/react-table` |
| URL state | `nuqs` | `nuqs` |
| Auth client | `better-auth` (configured) | `@/lib/auth-client` |
| Icons | `lucide-react` | `lucide-react` |
| Dates | `date-fns` + `@date-fns/tz` | `date-fns`, `@date-fns/tz` |
| Toasts | `sonner` | `sonner` |
| Class merging | `tailwind-merge` + `clsx` | `@/lib/utils` (`cn()`) |
| Component variants | `class-variance-authority` | `class-variance-authority` |
| Charts | `recharts` | `recharts` |
| Drag & drop | `@dnd-kit/core` + sortable | `@dnd-kit/*` |
| Drawers | `vaul` | `vaul` |
| Themes | `next-themes` | `next-themes` |

## Internal Utilities (prefer over raw imports)

| What | Use This | NOT This |
|---|---|---|
| API calls (frontend) | `import { api } from "@/lib/api"` | `import axios from "axios"` |
| Auth client (frontend) | `import { authClient } from "@/lib/auth-client"` | raw better-auth client |
| Prisma client (backend) | `import { prisma } from "./lib/prisma"` | `new PrismaClient()` |
| Auth server (backend) | `import { auth } from "./lib/auth"` | raw better-auth |
| Class merging | `cn()` from `@/lib/utils` | `clsx()` or `twMerge()` directly |

## Do NOT Install

- `moment.js` — use `date-fns`
- `react-query` (v3) — use `@tanstack/react-query` v5
- `formik` or `react-hook-form` — use `@tanstack/react-form`
- Any date library other than `date-fns`
- `zustand`, `jotai`, `redux` — no client state manager; use React Query + nuqs
- `react-router` or `wouter` — Next.js App Router handles routing
