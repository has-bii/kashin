# Project Structure

## Repo Layout

- `backend/` — Elysia + Bun API
- `frontend/` — Next.js 16 App Router
- `docker/` — Docker config
- `docs/` — Project documentation

## Backend: Where to Put New Things

| What | Where | Example |
|---|---|---|
| New domain module | `backend/src/modules/{domain}/` | `modules/invoice/` |
| Route handlers | `modules/{domain}/index.ts` | exports `invoiceController` |
| DB queries | `modules/{domain}/query.ts` | Prisma query functions |
| Business logic | `modules/{domain}/service.ts` | `InvoiceService` class |
| Auth middleware | `backend/src/macros/` | `auth.macro.ts` |
| Shared utilities | `backend/src/lib/` | `lib/prisma.ts`, `lib/auth.ts` |
| Global error types | `backend/src/global/` | `global/error.ts` |
| Generated Prisma | `backend/src/generated/prisma/` | auto-generated, don't edit |
| Generated Prismabox | `backend/src/generated/prismabox/` | auto-generated, don't edit |

### Backend Module Pattern

Each domain module has exactly 3 files:
```
modules/{domain}/
  index.ts    # Elysia controller — routes, auth, body/query validation
  query.ts    # Zod/Elysia query param schemas
  service.ts  # Business logic + Prisma calls, exported as {Domain}Service class
```

Register the controller in `backend/src/index.ts`.

## Frontend: Where to Put New Things

| What | Where | Example |
|---|---|---|
| New page | `frontend/src/app/{route}/page.tsx` | `app/dashboard/invoices/page.tsx` |
| Layout | `frontend/src/app/{route}/layout.tsx` | standard Next.js |
| Shared components | `frontend/src/components/` | `components/data-table.tsx` |
| shadcn/ui primitives | `frontend/src/components/ui/` | auto-added by shadcn CLI |
| Custom hooks | `frontend/src/hooks/` | `hooks/use-mobile.ts` |
| Shared utilities | `frontend/src/utils/` | `utils/format-amount.ts` |
| Types/enums | `frontend/src/types/` | `types/enums.ts` |
| Constants | `frontend/src/constants/` | `constants/indonesia.ts` |
| Library config | `frontend/src/lib/` | `lib/api.ts`, `lib/auth-client.ts` |
| nuqs parsers | `frontend/src/lib/nuqs-parser.ts` | URL state schemas |
| Global providers | `frontend/src/providers/index.tsx` | QueryClient, theme, auth |

## Frontend Organization

- **App Router** file-based routing under `src/app/`
- Route groups used for layout isolation: `(main)` group inside dashboard
- No feature-specific folders — components shared globally in `src/components/`
- `@/` alias maps to `frontend/src/`
