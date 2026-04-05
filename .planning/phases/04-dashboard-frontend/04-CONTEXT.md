# Phase 4: dashboard-frontend - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Connect the existing dashboard shell to real financial data from the Phase 3 backend. Replace all placeholder/mock data with live API responses. Deliver four widgets: balance summary cards, monthly trends bar chart, category breakdown donut chart, and recent transactions list.

No new backend endpoints. No transaction CRUD from this page. No navigation from dashboard widgets to other pages (read-only).

</domain>

<decisions>
## Implementation Decisions

### 4th Summary Card
- **D-01:** The 4th card displays **Savings Rate**, computed frontend-side as `(netBalance / totalIncome) × 100`.
  - No backend changes — Phase 3 is already complete; use existing `totalIncome` and `netBalance` from the summary response.
  - When `totalIncome === 0`, savings rate is `null` — render as `—` (matches UI-SPEC empty state behavior).
  - Positive savings rate: primary green badge. Negative: destructive red badge.

### Feature Module Structure
- **D-02:** All dashboard code lives in `frontend/src/features/dashboard/` — follows the established category/transaction feature pattern.
  - `api/` — TanStack Query options for all 4 dashboard endpoints
  - `components/` — all dashboard widgets (SectionCards, MonthlyTrendsChart, CategoryBreakdownChart, RecentTransactionsWidget, DashboardSkeleton)
  - `types/` — TypeScript types for API response shapes
- **D-03:** Existing placeholder components (`SectionCards`, `ChartAreaInteractive`) are moved into `features/dashboard/components/` and replaced with live-data versions. They no longer live in `src/components/`.

### Suspense Strategy
- **D-04:** **Per-widget Suspense boundaries** — each widget is its own `"use client"` component with `useSuspenseQuery()`.
  - Widgets load and render independently — fast data (e.g., recent transactions) appears before slow queries finish.
  - Dashboard page (`app/dashboard/(main)/page.tsx`) wraps each widget in its own `<Suspense fallback={<WidgetSkeleton />}>`.
  - Page itself stays a simple Server Component wrapper (no `"use client"` at page level).

### Placeholder Cleanup
- **D-05:** `DataTable` on the dashboard page is removed. `RecentTransactionsWidget` replaces it entirely.
  - `data.json` (static mock data) is deleted — dashboard-only file, no longer needed.
  - `chart-area-interactive.tsx` is deleted — replaced by `MonthlyTrendsChart` in `features/dashboard/components/`.
  - `data-table.tsx` in `src/components/` is left as-is — it is reused in the transaction page; do not delete.

### Claude's Discretion
- Exact file names within `features/dashboard/api/` (one file per endpoint vs combined)
- Internal query key structure for dashboard queries
- Skeleton dimensions (follow UI-SPEC height hints: h-32 for cards, h-[300px] for charts, h-10 per row for table)
- How to structure the `DashboardSkeleton` component (single export with named sub-exports vs separate files)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and UI-SPEC.

### UI Contract (MANDATORY)
- `.planning/phases/04-dashboard-frontend/04-UI-SPEC.md` — Full visual and interaction contract: layout, colors, copy, loading states, empty states, component inventory, interaction per widget. Agents MUST read this before planning any component.

### Feature pattern to follow
- `frontend/src/features/transaction/api/get-transactions.query.ts` — canonical `queryOptions()` pattern
- `frontend/src/features/transaction/` — full feature module structure (api/, components/, hooks/, types/)
- `frontend/src/features/category/api/get-categories.query.ts` — simpler query options example

### Existing dashboard placeholders (to replace)
- `frontend/src/components/section-cards.tsx` — current SectionCards placeholder; move + replace with live data
- `frontend/src/components/chart-area-interactive.tsx` — current chart placeholder; delete after MonthlyTrendsChart created
- `frontend/src/app/dashboard/(main)/page.tsx` — current page wiring; update to use new feature components + Suspense

### Dashboard page structure
- `frontend/src/app/dashboard/(main)/page.tsx` — current layout (SectionCards + ChartAreaInteractive + DataTable)
- `frontend/src/app/dashboard/data.json` — static mock data to delete

### Backend API contracts (Phase 3 output)
- `backend/src/modules/dashboard/index.ts` — route definitions: GET /dashboard/summary, /category-breakdown, /trends, /recent
- `backend/src/modules/dashboard/query.ts` — query param schemas (dateFrom, dateTo, months, limit)
- `backend/src/modules/dashboard/service.ts` — response shapes (what the frontend will receive)

### Shared UI primitives
- `frontend/src/components/ui/chart.tsx` — ChartContainer, ChartTooltip, ChartTooltipContent (shadcn chart primitives)
- `frontend/src/components/ui/card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction
- `frontend/src/components/ui/skeleton.tsx` — Skeleton primitive for loading states
- `frontend/src/components/ui/badge.tsx` — Badge for trend indicators
- `frontend/src/components/ui/toggle-group.tsx` — ToggleGroup for 3m/6m/12m time-range selector

### Auth (currency display)
- `frontend/src/lib/auth-client.ts` — `authClient.useSession()` — read user currency for Intl.NumberFormat (established Phase 2)

### Requirements
- `.planning/REQUIREMENTS.md` — DASH-01 through DASH-04 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/components/ui/chart.tsx` — `ChartContainer`, `ChartTooltip`, `ChartTooltipContent` — the correct chart wrapper for Recharts in this project; use for both donut and bar charts
- `frontend/src/components/ui/card.tsx` — `Card`, `CardAction`, `CardHeader`, `CardTitle`, `CardDescription`, `CardFooter` — used in SectionCards; reuse same structure
- `frontend/src/components/ui/skeleton.tsx` — already installed; use for all loading states
- `frontend/src/components/ui/toggle-group.tsx` — already installed; use for the 3m/6m/12m toggle in MonthlyTrendsChart
- `frontend/src/lib/auth-client.ts` — `authClient.useSession()` returns `user.currency` — always pass to `Intl.NumberFormat` for amount formatting

### Established Patterns
- Feature module: `features/<name>/api/<endpoint>.query.ts` exports `queryOptions()` + named query key function
- Suspense + dynamic import: `frontend/src/app/dashboard/(main)/category/page.tsx` — canonical pattern for page-level Suspense with dynamic import
- Query options: no per-query `staleTime`/`gcTime` — global config on root QueryClient handles it (Phase 2 decision)
- Amount formatting: `Intl.NumberFormat` with user currency from session (never hardcode $)
- `"use client"` placement: only on leaf components that use hooks; page stays Server Component

### Integration Points
- Dashboard page at `frontend/src/app/dashboard/(main)/page.tsx` — import and render all 4 widgets with Suspense wrappers
- API base URL: `frontend/src/lib/api.ts` Axios instance (already configured with `withCredentials: true`)
- Dashboard endpoints: `/dashboard/summary`, `/dashboard/category-breakdown`, `/dashboard/trends`, `/dashboard/recent`

</code_context>

<specifics>
## Specific Ideas

No specific external references beyond the UI-SPEC. Decisions were driven by the approved design contract and existing codebase patterns.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-dashboard-frontend*
*Context gathered: 2026-04-05*
