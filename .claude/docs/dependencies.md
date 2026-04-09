# Dependencies

## Backend — Use These (do NOT substitute)

| Purpose | Library | Notes |
|---------|---------|-------|
| API framework | `elysia` | Not Express, not Hono |
| Database ORM | `@prisma/client` | Generated at `src/generated/prisma` |
| Validation | `zod` v4 | Not class-validator, not joi |
| Auth | `better-auth` | Not NextAuth, not Lucia |
| Schema gen | `prismabox` | Auto-generates TypeBox from Prisma — don't write manually |
| Rate limiting | `elysia-rate-limit` | |
| CORS | `@elysiajs/cors` | |

## Frontend — Use These (do NOT substitute)

| Purpose | Library | Import From |
|---------|---------|-------------|
| HTTP requests | `axios` | `@/lib/api.ts` (the configured instance) |
| Server state | `@tanstack/react-query` | |
| Forms | `@tanstack/react-form` | Not react-hook-form |
| Tables | `@tanstack/react-table` | |
| Auth client | `better-auth/client` | `@/lib/auth-client.ts` |
| Icons | `lucide-react` | |
| Date utilities | `date-fns` + `@date-fns/tz` | Not moment, not dayjs |
| URL state | `nuqs` | `@/lib/nuqs-parser.ts` for parsers |
| UI primitives | `radix-ui` / shadcn components | `@/components/ui/` |
| Toasts | `sonner` | |
| Charts | `recharts` | |
| DnD | `@dnd-kit/core` + `@dnd-kit/sortable` | |

## Internal Wrappers (always use instead of raw library)

| What | Use This | NOT This |
|------|----------|----------|
| API calls | `@/lib/api.ts` (axios instance) | `import axios from 'axios'` directly |
| Auth client | `@/lib/auth-client.ts` | `better-auth/client` directly |
| Class merging | `@/lib/utils.ts` (`cn()`) | `clsx` or `twMerge` directly |
| Locale/tz utils | `@/lib/locale-utils.ts` | date-fns directly for locale/tz ops |

## Do NOT Install

- `moment` — use `date-fns`
- `react-hook-form` — use `@tanstack/react-form`
- `swr` — use `@tanstack/react-query`
- Any React memoization helpers — React Compiler handles it
