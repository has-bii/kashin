# Phase 4: Dashboard Frontend - Research

**Researched:** 2026-04-05
**Domain:** Next.js 16 App Router / TanStack Query v5 / Recharts 3 via shadcn chart primitives
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** 4th summary card = Savings Rate, computed frontend-side as `(netBalance / totalIncome) × 100`. When `totalIncome === 0`, render `—`. Positive = primary green badge; negative = destructive red badge.
- **D-02:** All dashboard code lives in `frontend/src/features/dashboard/` — `api/`, `components/`, `types/` subdirectories.
- **D-03:** Existing placeholder components (`SectionCards`, `ChartAreaInteractive`) are moved into `features/dashboard/components/` and replaced with live-data versions. They no longer live in `src/components/`.
- **D-04:** Per-widget Suspense boundaries — each widget is its own `"use client"` component with `useSuspenseQuery()`. Dashboard page (`app/dashboard/(main)/page.tsx`) wraps each widget in its own `<Suspense fallback={<WidgetSkeleton />}>`. Page itself stays a Server Component.
- **D-05:** `DataTable` on dashboard page removed; `RecentTransactionsWidget` replaces it. `data.json` deleted. `chart-area-interactive.tsx` deleted. `data-table.tsx` in `src/components/` is NOT deleted (reused in transaction page).

### Claude's Discretion

- Exact file names within `features/dashboard/api/` (one file per endpoint vs combined)
- Internal query key structure for dashboard queries
- Skeleton dimensions (follow UI-SPEC height hints: h-32 for cards, h-[300px] for charts, h-10 per row for table)
- How to structure the `DashboardSkeleton` component (single export with named sub-exports vs separate files)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DASH-01 | User can see spending breakdown by category as a chart (connected to real transaction data) | `CategoryBreakdownChart` consuming `/dashboard/category-breakdown`; shadcn `PieChart` with `ChartContainer` |
| DASH-02 | User can see income vs expenses balance overview for a date range | `SectionCards` consuming `/dashboard/summary`; 4 cards rendered from live data |
| DASH-03 | User can see monthly spending trends chart | `MonthlyTrendsChart` consuming `/dashboard/trends?months=N`; shadcn `BarChart` with `ChartContainer` |
| DASH-04 | User can see a recent transactions widget on the dashboard | `RecentTransactionsWidget` consuming `/dashboard/recent?limit=10` |
</phase_requirements>

---

## Summary

Phase 4 wires the existing dashboard shell to four Phase 3 backend endpoints (`/dashboard/summary`, `/dashboard/category-breakdown`, `/dashboard/trends`, `/dashboard/recent`). No new backend work is needed — the Phase 3 service layer is confirmed complete. The core implementation work is: create a `features/dashboard/` module following established feature patterns, write four `queryOptions()` files using `useSuspenseQuery()`, build four widget components with Skeleton fallbacks, and update the dashboard page to use Suspense-wrapped widgets.

The project already has `ChartContainer`, `ChartTooltip`, and `ChartTooltipContent` installed in `src/components/ui/chart.tsx`. These wrap Recharts 3 with CSS-variable-based color injection and a `ChartConfig` record. Both the `BarChart` (for trends) and `PieChart` (for category breakdown) plug into this same container. The `ChartLegend` / `ChartLegendContent` exports are also available for the donut legend.

The Suspense strategy mirrors what's done in the category page (`next/dynamic` with `ssr: false` + `loading` prop for skeleton). However, D-04 locks the pattern as per-widget `useSuspenseQuery()` + `<Suspense fallback={...}>` at the page level, which is the idiomatic TanStack Query v5 approach and does NOT require `next/dynamic`.

**Primary recommendation:** Follow the `features/transaction/api/get-transactions.query.ts` pattern exactly for all four query options files, use `useSuspenseQuery()` (not `useQuery()`) in widget components, wrap each widget in `<Suspense>` at the page level, and use `ChartContainer` from the existing `chart.tsx` for both charts.

---

## Standard Stack

### Core (all already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@tanstack/react-query` | 5.96.1 | Server state, `useSuspenseQuery` | Global QueryClient configured; established pattern |
| `recharts` | 3.8.0 | Chart primitives (Bar, Pie, Cell, etc.) | Already used via `chart.tsx` |
| `next/dynamic` | — | Code-splitting (optional here; Suspense preferred per D-04) | Used in category page |
| `react` (Suspense) | 19.2.4 | Suspense boundaries | Compiler-aware; no manual memo needed |

### Supporting (all already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `better-auth` (client) | 1.5.6 | `authClient.useSession()` for user currency | All amount format calls |
| `lucide-react` | 1.7.0 | `TrendingUpIcon`, `TrendingDownIcon` | Trend badge icons |
| `sonner` | 2.0.7 | Toasts | Not needed (dashboard is read-only; inline error message used instead) |

**Installation:** None required — all dependencies exist in `frontend/package.json`. [VERIFIED: file inspection]

---

## Architecture Patterns

### Recommended Feature Module Structure

```
frontend/src/features/dashboard/
  api/
    get-dashboard-summary.query.ts
    get-dashboard-category-breakdown.query.ts
    get-dashboard-trends.query.ts
    get-dashboard-recent.query.ts
  components/
    SectionCards.tsx            ← moved + rewritten from src/components/section-cards.tsx
    MonthlyTrendsChart.tsx      ← replaces chart-area-interactive.tsx
    CategoryBreakdownChart.tsx  ← new
    RecentTransactionsWidget.tsx ← new, replaces DataTable + data.json
    DashboardSkeleton.tsx       ← all skeleton sub-exports in one file
  types/
    index.ts                    ← TypeScript interfaces for all 4 API responses
```

### Pattern 1: Query Options File (canonical)

[VERIFIED: file inspection of `frontend/src/features/transaction/api/get-transactions.query.ts`]

```typescript
// frontend/src/features/dashboard/api/get-dashboard-summary.query.ts
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

export type DashboardSummaryParams = {
  dateFrom?: string
  dateTo?: string
}

export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  netBalance: number
}

const getDashboardSummary = async (params: DashboardSummaryParams) => {
  const { data } = await api.get<DashboardSummary>("/dashboard/summary", { params })
  return data
}

export const getDashboardSummaryQueryKey = (params: DashboardSummaryParams) =>
  ["dashboard", "summary", params]

export const getDashboardSummaryQueryOptions = (params: DashboardSummaryParams) =>
  queryOptions({
    queryKey: getDashboardSummaryQueryKey(params),
    queryFn: () => getDashboardSummary(params),
  })
```

**Do NOT add `staleTime`/`gcTime` — set globally on root `QueryClient` (established Phase 2 decision).** [VERIFIED: CONTEXT.md + feedback memory]

### Pattern 2: Widget Component with useSuspenseQuery + Suspense (per D-04)

```typescript
// frontend/src/features/dashboard/components/SectionCards.tsx
"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { getDashboardSummaryQueryOptions } from "../api/get-dashboard-summary.query"
import { authClient } from "@/lib/auth-client"

export function SectionCards() {
  const { data } = useSuspenseQuery(getDashboardSummaryQueryOptions({}))
  const { data: session } = authClient.useSession()
  const currency = session?.user?.currency ?? "USD"
  // ...render with Intl.NumberFormat(currency)
}
```

### Pattern 3: Dashboard Page (Server Component with per-widget Suspense)

[VERIFIED: D-04 locked decision + category page pattern]

```typescript
// frontend/src/app/dashboard/(main)/page.tsx
import { Suspense } from "react"
import { SectionCards } from "@/features/dashboard/components/SectionCards"
import { SectionCardsSkeleton } from "@/features/dashboard/components/DashboardSkeleton"
// ... imports for other widgets

export default function Page() {
  return (
    <>
      <SiteHeader label="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense fallback={<SectionCardsSkeleton />}>
              <SectionCards />
            </Suspense>
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
              <Suspense fallback={<ChartSkeleton />}>
                <MonthlyTrendsChart />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <CategoryBreakdownChart />
              </Suspense>
            </div>
            <Suspense fallback={<TransactionsSkeleton />}>
              <RecentTransactionsWidget />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
```

### Pattern 4: ChartContainer Usage (shadcn chart primitives)

[VERIFIED: file inspection of `frontend/src/components/ui/chart.tsx`]

```typescript
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  income: { label: "Income", color: "var(--primary)" },
  expense: { label: "Expenses", color: "var(--destructive)" },
} satisfies ChartConfig

export function MonthlyTrendsChart() {
  // data from useSuspenseQuery
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
```

`ChartContainer` injects CSS vars `--color-{key}` from the `config` record. Access them in Recharts props as `"var(--color-income)"`. [VERIFIED: chart.tsx source `ChartStyle` function]

### Pattern 5: Donut Chart (PieChart with innerRadius)

```typescript
import { PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

// Category colors from API response or fallback to --chart-1 through --chart-5
const FALLBACK_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function CategoryBreakdownChart() {
  const { data } = useSuspenseQuery(getDashboardCategoryBreakdownQueryOptions({}))
  // data: Array<{ categoryId, category: { name, icon, color }, total }>

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category.name" innerRadius={60}>
          {data.map((entry, index) => (
            <Cell
              key={entry.categoryId}
              fill={entry.category?.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
            />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  )
}
```

### Pattern 6: Savings Rate Computation (D-01)

```typescript
const savingsRate = data.totalIncome === 0
  ? null
  : (data.netBalance / data.totalIncome) * 100

// Render:
// null → "—"
// ≥ 0  → primary green badge
// < 0  → destructive red badge
```

### Pattern 7: Amount Formatting (established convention)

```typescript
const { data: session } = authClient.useSession()
const currency = session?.user?.currency ?? "USD"

const formatAmount = (amount: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount)
```

[VERIFIED: CONTEXT.md code_context + Phase 2 decision in STATE.md]

### Anti-Patterns to Avoid

- **`useQuery` instead of `useSuspenseQuery` in widgets:** D-04 mandates `useSuspenseQuery()`. Using `useQuery()` bypasses the Suspense boundary and requires manual loading state handling per widget.
- **Adding `staleTime`/`gcTime` to individual `queryOptions()`:** Global config handles this. Adding per-query overrides is explicitly forbidden.
- **`React.memo`, `useMemo`, `useCallback`:** React Compiler handles all memoization. Never add these manually.
- **Hardcoded `"$"` or `"USD"`:** Always use `authClient.useSession()` for currency — users may have different locales.
- **Leaving `data.json` and `chart-area-interactive.tsx` in place:** D-05 mandates deletion of both.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chart color injection | Manual inline styles or class mapping | `ChartContainer` + `ChartConfig` `--color-{key}` vars | Already handles light/dark theme injection |
| Tooltip formatting | Custom tooltip component | `ChartTooltipContent` | Handles indicator styles, label formatting, value display |
| Legend rendering | Custom legend div | `ChartLegendContent` | Integrates with ChartConfig labels |
| Skeleton loading | Conditional render with opacity | `<Skeleton>` from `ui/skeleton` | Already installed, consistent visual weight |
| Currency formatting | String interpolation | `Intl.NumberFormat` | Locale-aware, handles all currencies |
| Date range defaults | Manual Date math in frontend | Pass no params to query options (backend defaults to current month) | Backend `resolveMonthRange()` handles the default |

---

## Backend API Contracts (Phase 3 — Verified)

[VERIFIED: file inspection of `backend/src/modules/dashboard/index.ts`, `service.ts`, `query.ts`]

### `GET /dashboard/summary`
**Query params:** `dateFrom?`, `dateTo?` (both optional strings; defaults to current calendar month)
**Response shape:**
```typescript
{ totalIncome: number; totalExpense: number; netBalance: number }
```

### `GET /dashboard/category-breakdown`
**Query params:** `dateFrom?`, `dateTo?`
**Response shape:**
```typescript
Array<{
  categoryId: string | null
  category: { id: string; name: string; icon: string; color: string } | undefined
  total: number
}>
```

### `GET /dashboard/trends`
**Query params:** `months?` (number, min 1, max 24, default 6)
**Response shape:**
```typescript
Array<{ month: string; income: number; expense: number }>
// month format: "YYYY-MM"
```

### `GET /dashboard/recent`
**Query params:** `limit?` (number, min 1, max 50, default 5)
**Response shape:** Full `Transaction` records with `category` included (same shape as `Transaction` type in `frontend/src/features/transaction/types/index.ts`)

---

## Common Pitfalls

### Pitfall 1: Month Label Formatting for X-Axis
**What goes wrong:** The backend returns `"YYYY-MM"` format (e.g., `"2026-03"`). Rendering this directly on the chart X-axis is ugly.
**Why it happens:** `DashboardService.trends()` uses `buildMonthBuckets()` which outputs `YYYY-MM` keys.
**How to avoid:** Map month labels in the component: `new Date(month + "-01").toLocaleDateString(undefined, { month: "short" })` to get `"Mar"`.

### Pitfall 2: `useSuspenseQuery` vs `useQuery` Scope
**What goes wrong:** Using `useSuspenseQuery` in a component that is NOT wrapped in `<Suspense>` throws during render.
**Why it happens:** `useSuspenseQuery` relies on React's Suspense protocol — it throws a promise, which must be caught by a boundary.
**How to avoid:** Every widget using `useSuspenseQuery` must have its parent wrap it in `<Suspense fallback={...}>`. The dashboard page handles this.

### Pitfall 3: `"use client"` Propagation
**What goes wrong:** Marking the dashboard page itself as `"use client"` collapses all Server Component benefits.
**Why it happens:** Developers add `"use client"` to the page when widgets need client-side hooks.
**How to avoid:** Only widget components get `"use client"`. The page at `app/dashboard/(main)/page.tsx` stays a Server Component. [VERIFIED: D-04 + category page pattern]

### Pitfall 4: Category Color Field May Be `null` or User-defined Emoji Color
**What goes wrong:** The `category.color` field from the API is a free-form string (user-picked). It may not be a valid CSS color — it could be an emoji color name or other string.
**Why it happens:** Category `color` field is user-entered in the category editor.
**How to avoid:** Always have a `--chart-N` fallback. Use `entry.category?.color ?? FALLBACK_COLORS[index % 5]`.

### Pitfall 5: Empty State Confusion with Zero Data
**What goes wrong:** A chart renders with a blank/broken layout when `data` is an empty array.
**Why it happens:** Recharts `PieChart` with empty data array can throw or render nothing.
**How to avoid:** Check `data.length === 0` before rendering the chart and show the empty state copy instead. The UI-SPEC specifies exact copy per widget.

### Pitfall 6: Deleting `data-table.tsx`
**What goes wrong:** If `data-table.tsx` in `src/components/` is deleted alongside `data.json`, the transaction page breaks.
**Why it happens:** D-05 says to delete `data.json` and `chart-area-interactive.tsx`, but explicitly states `data-table.tsx` must NOT be deleted.
**How to avoid:** Only delete `data.json` and `chart-area-interactive.tsx`. Leave `data-table.tsx`.

---

## Existing Files to Delete / Move (per D-03, D-05)

| File | Action | Replacement |
|------|--------|-------------|
| `frontend/src/components/section-cards.tsx` | Move + rewrite | `features/dashboard/components/SectionCards.tsx` |
| `frontend/src/components/chart-area-interactive.tsx` | Delete | `features/dashboard/components/MonthlyTrendsChart.tsx` |
| `frontend/src/app/dashboard/data.json` | Delete | No replacement (was mock data) |
| `frontend/src/app/dashboard/(main)/page.tsx` | Rewrite in-place | Suspense-wrapped widget imports |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Not yet configured (from CLAUDE.md: "Not yet configured (framework ready for Jest/Vitest)") |
| Config file | None detected |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DASH-01 | Category breakdown chart renders with data | manual-only | — | ❌ No test framework |
| DASH-02 | Summary cards display live API values | manual-only | — | ❌ No test framework |
| DASH-03 | Trends chart shows bar per month | manual-only | — | ❌ No test framework |
| DASH-04 | Recent transactions widget lists last 10 | manual-only | — | ❌ No test framework |

**Note:** No automated test framework is configured for the frontend. Validation is visual/manual — load the dashboard, verify each widget renders real data, verify skeleton loading appears then resolves, verify empty states when no transactions exist.

### Wave 0 Gaps
- No test infrastructure exists for frontend. Manual browser testing is the validation path for this phase.

---

## Environment Availability

Step 2.6: SKIPPED — phase is purely frontend code changes with no new external CLI dependencies. All required services (PostgreSQL, backend server) are pre-existing.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | All widgets use `{ auth: true }` endpoints via Better Auth session cookie (`withCredentials: true` in Axios) |
| V3 Session Management | yes | Better Auth + cookie — already handled by existing `auth-client.ts` |
| V4 Access Control | yes | All queries filter by `userId` in backend service layer (Phase 3 verified) |
| V5 Input Validation | yes | Query params passed to backend are numbers/strings — no user-supplied HTML; Axios handles serialization |
| V6 Cryptography | no | No crypto operations in this phase |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Cross-user data access | Elevation of Privilege | Backend filters all queries by `userId` — frontend passes no userId (server extracts from session) |
| Missing auth on dashboard API calls | Spoofing | `{ auth: true }` macro on all 4 dashboard endpoints — returns 401 if no session |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `Transaction.category.color` field is a CSS color string (or may be any string) | Common Pitfalls #4 | If it's always a valid hex/CSS color, fallback logic is unnecessarily defensive but harmless |
| A2 | `authClient.useSession()` returns `user.currency` as a valid BCP-47 currency code | Pattern 7 | `Intl.NumberFormat` would throw for an invalid currency code; fallback `"USD"` mitigates this |

---

## Open Questions

1. **Month label X-axis format**
   - What we know: Backend returns `"YYYY-MM"` strings
   - What's unclear: Whether abbreviated month (`"Mar"`) or `"Mar '26"` is preferred
   - Recommendation: Use `"short"` month only (`toLocaleDateString(undefined, { month: "short" })`); only add year when `months > 12` (two calendar years shown)

2. **RecentTransactionsWidget — `limit` parameter**
   - What we know: UI-SPEC says "last 10 transactions"; backend default is 5
   - What's unclear: The CONTEXT says "limit=10" — this must be explicitly passed as query param
   - Recommendation: Always pass `limit: 10` explicitly in `getDashboardRecentQueryOptions(10)` from the page

---

## Sources

### Primary (HIGH confidence)
- File inspection: `backend/src/modules/dashboard/index.ts`, `service.ts`, `query.ts` — full API contract verified
- File inspection: `frontend/src/components/ui/chart.tsx` — ChartContainer, ChartConfig, ChartStyle implementation
- File inspection: `frontend/src/features/transaction/api/get-transactions.query.ts` — canonical query options pattern
- File inspection: `frontend/src/app/dashboard/(main)/page.tsx` — current page structure (mock data)
- File inspection: `frontend/src/components/section-cards.tsx` — existing placeholder structure
- File inspection: `frontend/src/app/dashboard/(main)/category/page.tsx` — Suspense + dynamic import pattern
- File inspection: `frontend/src/features/transaction/types/index.ts` — Transaction type (reused for recent widget)
- `.planning/phases/04-dashboard-frontend/04-CONTEXT.md` — locked decisions
- `.planning/phases/04-dashboard-frontend/04-UI-SPEC.md` — visual and interaction contract

### Secondary (MEDIUM confidence)
- `CLAUDE.md` (root + frontend) — stack constraints, patterns, conventions

---

## Metadata

**Confidence breakdown:**
- API contracts: HIGH — verified by reading Phase 3 backend source
- Standard stack: HIGH — verified by file inspection (all deps already installed)
- Architecture patterns: HIGH — verified against existing transaction/category feature modules
- Chart primitives: HIGH — verified by reading chart.tsx implementation
- Pitfalls: MEDIUM — derived from code reading and known Recharts/Suspense behavior

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable stack, 30 days)
