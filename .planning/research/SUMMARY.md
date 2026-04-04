# Project Research Summary

**Project:** Kashin — Transaction CRUD + Dashboard Milestone
**Domain:** Personal finance tracker (manual entry, single user)
**Researched:** 2026-04-04
**Confidence:** HIGH

## Executive Summary

Kashin is a personal expense and income tracker being extended from a working auth + category foundation to a full transaction management and dashboard experience. The established stack (Bun + Elysia, Prisma 7, Next.js 16, shadcn/ui, TanStack Query) is well-suited for this milestone and requires only minor additions: shadcn chart primitives (using the already-installed Recharts 3.8.0) and date-fns v3 for date formatting. No backend dependencies are needed beyond what exists.

The recommended approach is backend-first, phase-by-phase: build transaction CRUD on the backend, then the frontend, then dashboard aggregations on the backend, then dashboard UI. This order ensures the frontend is never blocked waiting for APIs, and that charts have real data to render during development. The architecture cleanly separates a `transaction` module (CRUD) from a `dashboard` module (read-only aggregation) — mixing them would create a maintenance burden as dashboard complexity grows.

The most critical risks are all schema-level decisions in Phase 1: storing amounts as `DECIMAL(12,2)` not `Float`, adding v2-ready nullable fields (`source`, `status`, `aiRawData`) now to avoid a future migration, and enforcing composite indexes from day one. These are zero-cost to do upfront and high-cost to retrofit. A secondary risk is the chart SSR boundary in Next.js App Router — chart components must be explicitly wrapped in `"use client"` to avoid hydration errors.

---

## Key Findings

### Recommended Stack

The existing stack handles all Milestone 1 needs. No major new dependencies are required. Recharts 3.8.0 is already installed and React 19 compatible; shadcn's `<ChartContainer>` wrapper integrates it cleanly with Tailwind theming. Currency display uses native `Intl.NumberFormat` (zero bundle cost). URL state for filters is handled by nuqs 2.8.9 (already installed).

**Core technologies (additions only):**
- `shadcn chart` primitives — charts with Tailwind theming, wraps existing Recharts 3.8.0
- `date-fns` v3 — date formatting, tree-shakeable, Bun + Next.js compatible (stay on v3, not v4 ESM-only)
- `Intl.NumberFormat` (native) — currency display, no library needed

### Expected Features

**Must have (table stakes):**
- Transaction CRUD — create/edit/delete with type, amount, date, category, optional note/vendor
- Transaction list — paginated, sortable, filterable by date range / category / type
- Dashboard balance summary — income total / expense total / net for selected period
- Category breakdown chart — donut/pie showing spend by category
- Monthly trend chart — bar chart over trailing 6 months
- Recent transactions widget — last 10 entries on dashboard

**Should have (competitive differentiators):**
- Vendor/merchant field on transactions — enables richer search, primes v2 AI extraction
- v2-ready data model columns (`source`, `status`, `aiRawData`) — nullable, zero UI cost now
- Sorting on transaction list — date DESC default, amount sort for finding large spends
- "This month at a glance" hero summary row

**Defer (v2+):**
- Search transactions — add after core list ships
- Inline edit from list — nice-to-have, not blocking
- Bank sync, CSV import, budget goals, recurring transactions, multi-currency — all explicitly out of scope

### Architecture Approach

The architecture separates two backend modules — `transaction` (CRUD) and `dashboard` (read-only aggregation via `$queryRaw`) — and two frontend features mirroring them. Dashboard never calls TransactionService; both talk to Prisma independently. All queries filter by `userId` and `status = 'CONFIRMED'` so v2 pending entries never pollute reports.

**Major components:**
1. `backend/src/modules/transaction/` — CRUD routes, TransactionService, prismabox validation
2. `backend/src/modules/dashboard/` — GET-only aggregation routes, DashboardService with `$queryRaw`
3. `frontend/src/features/transaction/` — TransactionForm, TransactionList, TransactionFilters, TanStack Query options
4. `frontend/src/features/dashboard/` — BalanceCard, MonthlyChart, CategoryChart, RecentList

**Key patterns:**
- `date` field (user-intent) not `createdAt` for all aggregations — financial records are backfilled
- `DECIMAL(12,2)` for amount, serialized as string over the wire, never `Float`
- Status-gated visibility: `WHERE status = 'CONFIRMED'` on all user-visible queries from day one

### Critical Pitfalls

1. **Amount stored as Float** — causes irrecoverable rounding drift in totals. Use `Decimal @db.Decimal(12,2)` in schema, serialize as string in JSON. Address in Phase 1 before any data is written.
2. **Missing userId guard on every query** — IDOR vulnerability: any user can read/delete another's transactions. Every Prisma call must include `where: { id, userId }`, never `where: { id }` alone.
3. **Schema not v2-ready** — adding `source`, `status`, `aiRawData` later requires a migration on a live table. Add as nullable fields with defaults now at zero cost.
4. **Chart components in Server Components** — Recharts uses browser APIs; placing charts in Server Components causes hydration errors. Wrap in `"use client"` at the chart component level, not the page level.
5. **Fetching all rows for client-side filtering** — `GET /transactions` must accept pagination + filter params from day one. Retrofitting server-side filtering later is always harder than building it correctly once.

---

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Transaction Schema + Backend CRUD
**Rationale:** Every other feature depends on the transaction data model. This is the highest-leverage phase — schema mistakes here are the most expensive to fix. Backend-first so frontend is never blocked.
**Delivers:** Prisma schema with v2-ready fields, working CRUD API with server-side filtering and pagination, userId-guarded endpoints.
**Addresses:** All table stakes transaction features (create, edit, delete, list with filters)
**Avoids:** Float amount pitfall, missing userId guard, v2 schema unreadiness, missing indexes, unfiltered list endpoints

### Phase 2: Transaction Frontend
**Rationale:** API is complete; frontend can be built and tested against real endpoints. Forms, list, and filters are the primary user-facing workflow.
**Delivers:** TransactionForm (create/edit), TransactionList with date/category/type filters (nuqs URL state), delete confirm dialog, pagination.
**Uses:** TanStack React Form + Zod v4, nuqs for URL state, shadcn/ui components
**Implements:** `frontend/src/features/transaction/` feature module

### Phase 3: Dashboard Backend
**Rationale:** Dashboard aggregations are read-only and depend on transaction data existing. Separate `dashboardController` + `DashboardService` from transaction module — don't mix.
**Delivers:** 3 aggregation endpoints: `/dashboard/summary`, `/dashboard/monthly`, `/dashboard/categories`
**Implements:** `$queryRaw` aggregation queries, all filtered by `status = 'CONFIRMED'`
**Avoids:** Merging dashboard into transaction controller (anti-pattern)

### Phase 4: Dashboard Frontend
**Rationale:** All APIs exist; charts can render against real data. Suspense boundaries ensure perceived performance.
**Delivers:** BalanceCard (income/expenses/net), MonthlyChart (bar, 6 months), CategoryChart (donut by category), RecentList (last 10 transactions), Suspense skeletons.
**Uses:** shadcn chart primitives (Recharts wrapper), date-fns v3, `Intl.NumberFormat`
**Avoids:** Chart SSR hydration pitfall, missing Suspense boundaries

### Phase Ordering Rationale

- Schema and API before UI in every phase — never blocks frontend on missing endpoints
- CRUD before dashboard — charts are untestable without real data
- Separate backend and frontend phases — clear deliverables, natural review points
- v2-ready fields added in Phase 1 — zero cost now, avoids migration later

### Research Flags

Phases with standard, well-documented patterns (skip research-phase):
- **Phase 1:** Transaction CRUD with Prisma follows established patterns; category module is an identical reference
- **Phase 2:** TanStack Form + Zod + nuqs filter patterns are established in codebase
- **Phase 3:** SQL aggregation patterns fully documented in ARCHITECTURE.md
- **Phase 4:** shadcn chart integration is documented; Recharts is already installed

No phase requires deeper research beyond what's already in these four documents.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Recharts already installed and verified React 19 compatible; shadcn chart is official integration |
| Features | MEDIUM | Based on competitive analysis (Monarch, Copilot, YNAB) + PROJECT.md as primary source |
| Architecture | HIGH | Prisma Decimal, PostgreSQL B-tree indexes, and separate service patterns are well-established |
| Pitfalls | HIGH | Float/money and IDOR pitfalls are verified; chart SSR confirmed via Next.js docs |

**Overall confidence:** HIGH

### Gaps to Address

- **date-fns v4 ESM compatibility:** v3 is the safe choice now. Validate v4 ESM compatibility if Next.js moves to full ESM-only mode in a future upgrade.
- **Dashboard query performance at scale:** `$queryRaw` aggregations are correct at personal-use scale. Verify with `EXPLAIN ANALYZE` if ever moving to multi-user SaaS.
- **Amount wire format enforcement:** Prisma returns `Decimal` as string by default via `@prisma/adapter-pg` — verify this is consistent in Elysia serialization before shipping the API contract.

---

## Sources

### Primary (HIGH confidence)
- PROJECT.md — requirements, out-of-scope, constraints (primary specification)
- PostgreSQL documentation — index types, NUMERIC type, B-tree vs BRIN
- Prisma 7 docs — Decimal type, `$queryRaw`, `groupBy`
- shadcn/ui chart docs + React 19 compatibility notes

### Secondary (MEDIUM confidence)
- Recharts GitHub issues — React 19 compatibility (#4558), v3.8.x resolution
- date-fns npm — v3 vs v4 ESM status
- Monarch Money, Copilot, YNAB feature overviews — feature landscape benchmarking
- Engadget / Expensify budgeting app comparisons 2026

### Tertiary (LOW confidence / internal audit)
- Codebase CONCERNS.md — race conditions, CSRF gaps, N+1 potential (internal, 2026-04-04)
- Community patterns for Prisma soft delete and partial indexes

---
*Research completed: 2026-04-04*
*Ready for roadmap: yes*
