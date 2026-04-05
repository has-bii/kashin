# Phase 3: Dashboard Backend - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Four read-only aggregation endpoints in a dedicated `dashboard` module, separated from the transaction CRUD module. No mutations. Delivers the data contracts that Phase 4 (dashboard frontend) will consume to replace all placeholder/mock data.

Endpoints in scope:
1. Summary — total income, total expenses, net balance for a date range
2. Category breakdown — spend totals grouped by category for a date range
3. Monthly trends — income and expense totals per month for trailing N months
4. Recent transactions — last N transactions for the dashboard widget

</domain>

<decisions>
## Implementation Decisions

### Aggregate amount format
- **D-01:** Return aggregated amounts (totals in summary, category breakdown, monthly trends) as **numbers**, not strings.
  - Parse `Decimal` to float in the service layer (`parseFloat(result.toString())`)
  - Rationale: charts (Recharts) and display formatting (`Intl.NumberFormat`) consume numbers directly — no extra parsing on the frontend
  - Individual transaction amounts in Phase 1 remain strings; this only applies to computed aggregates

### Trends window
- **D-02:** Monthly trends endpoint accepts a `?months=N` query param.
  - Default: `6` if omitted
  - Frontend controls the window (e.g., 6 or 12 months) — matches the chart placeholder's toggle pattern
  - Backend returns exactly N months of data, including months with zero activity (zero-filled)

### Recent transactions count
- **D-03:** Recent transactions endpoint accepts a `?limit=N` query param.
  - Default: `5` if omitted
  - Returns last N transactions ordered by `transactionDate` desc
  - Reuse the existing `categoryInclude` shape from `TransactionService` (nested category object)

### Date range defaults
- **D-04:** When `dateFrom`/`dateTo` are omitted from summary and category breakdown endpoints, default to **current month**.
  - Consistent with Phase 2 transaction list default (current month on page load)
  - Service computes start-of-month and end-of-month when params are absent
  - Monthly trends endpoint ignores `dateFrom`/`dateTo` — it always uses the `months` param going back from today

### Module structure
- **D-05:** New module at `backend/src/modules/dashboard/`
  - `index.ts` — Elysia controller, all routes read-only (`GET` only)
  - `service.ts` — `export abstract class DashboardService { static ... }`
  - `query.ts` — Typebox query param schemas for each endpoint
  - Mount in `backend/src/index.ts` alongside other modules
  - All routes guarded with `authMacro` and `{ auth: true }`
  - All service methods: `userId` as first param

### Claude's Discretion
- Exact Prisma `groupBy` / `aggregate` query structure for each endpoint
- How to zero-fill missing months in the trends response
- Whether to use `prisma.$transaction` for multi-query consistency in summary endpoint

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Transaction module (pattern to follow)
- `backend/src/modules/transaction/index.ts` — controller pattern: Elysia plugin, authMacro, route handlers
- `backend/src/modules/transaction/service.ts` — service pattern: static abstract class, `userId` first, categoryInclude shape
- `backend/src/modules/transaction/query.ts` — Typebox query param schema pattern

### Schema
- `backend/prisma/schema.prisma` — Transaction model fields: `type`, `amount` (Decimal), `transactionDate`, `categoryId`, `userId`; indexes available: `[userId, transactionDate]`, `[userId, type]`, `[userId, categoryId]`

### App entry point
- `backend/src/index.ts` — where new module controller is mounted with `.use()`

### Dashboard shell (what the frontend needs)
- `frontend/src/app/dashboard/(main)/page.tsx` — current placeholder layout (SectionCards, ChartAreaInteractive, DataTable)
- `frontend/src/components/section-cards.tsx` — placeholder showing 4 summary cards (income, expense, net balance, trend)
- `frontend/src/components/chart-area-interactive.tsx` — area chart placeholder; uses Recharts with income/expense series per month

### Requirements
- `.planning/REQUIREMENTS.md` — DASH-01 through DASH-04 specs

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TransactionService` `categoryInclude` const — reuse the same `{ category: { select: { id, name, type, icon, color } } }` shape for recent transactions endpoint
- Auth macro pattern — `.use(authMacro)` + `{ auth: true }` already established across all modules
- `prisma.$transaction([...])` — used in `TransactionService.getAll` for atomic pagination; applicable to summary endpoint if multiple aggregates needed in one consistent read

### Established Patterns
- Query param schemas: Typebox `t.Object({ field: t.Optional(...) })` in `query.ts`, validated at controller level
- Static abstract service class: `export abstract class DashboardService { static async summary(...) {} }`
- Amount handling: `Decimal` values from Prisma — call `.toNumber()` or `parseFloat(val.toString())` in service layer for aggregate responses
- All queries filter by `userId` — never query without it

### Integration Points
- Mount: `backend/src/index.ts` → `.use(dashboardController)` alongside `categoryController`, `transactionController`
- Frontend will call: `GET /dashboard/summary`, `GET /dashboard/category-breakdown`, `GET /dashboard/trends`, `GET /dashboard/recent`
- Existing indexes on `transactions` table cover all planned queries: `[userId, transactionDate]`, `[userId, type]`, `[userId, categoryId]`

</code_context>

<specifics>
## Specific Ideas

No specific UI references — this is a backend-only phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-dashboard-backend*
*Context gathered: 2026-04-05*
