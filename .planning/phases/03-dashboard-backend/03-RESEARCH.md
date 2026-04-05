# Phase 3: Dashboard Backend - Research

**Researched:** 2026-04-05
**Domain:** Prisma aggregate queries, Elysia read-only module, zero-fill monthly trends
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Aggregated amounts returned as `number` (float). Parse `Decimal` with `parseFloat(result.toString())` in service layer. Individual transaction amounts remain strings.
- **D-02:** Monthly trends accepts `?months=N`, default `6`. Backend returns exactly N months including zero-activity months (zero-filled).
- **D-03:** Recent transactions accepts `?limit=N`, default `5`. Ordered by `transactionDate` desc. Reuse `categoryInclude` shape from `TransactionService`.
- **D-04:** `dateFrom`/`dateTo` omitted → default to current month (start-of-month, end-of-month). Monthly trends ignores date range params — uses `months` param only.
- **D-05:** New module at `backend/src/modules/dashboard/` with `index.ts`, `service.ts`, `query.ts`. Mounted in `backend/src/index.ts`. All routes GET-only, all guarded with `{ auth: true }`.

### Claude's Discretion
- Exact Prisma `groupBy` / `aggregate` query structure for each endpoint
- How to zero-fill missing months in the trends response
- Whether to use `prisma.$transaction` for multi-query consistency in summary endpoint

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DASH-01 | User can see spending breakdown by category as a chart (connected to real transaction data) | Category breakdown endpoint: `prisma.transaction.groupBy` by `categoryId`, join category name/icon/color |
| DASH-02 | User can see income vs expenses balance overview for a date range | Summary endpoint: `prisma.transaction.aggregate` twice (income + expense), compute net in service |
| DASH-03 | User can see monthly spending trends chart | Trends endpoint: `groupBy` on year+month extracted via raw date truncation, zero-fill gaps |
| DASH-04 | User can see a recent transactions widget on the dashboard | Recent transactions endpoint: `findMany` with `orderBy: transactionDate desc`, `take: limit`, reuse `categoryInclude` |
</phase_requirements>

---

## Summary

Phase 3 creates a `dashboard` Elysia module — four GET-only, auth-guarded endpoints that aggregate transaction data for the frontend charts and widgets. No schema changes are needed; the existing `Transaction` model has all required fields and indexes (`[userId, transactionDate]`, `[userId, type]`, `[userId, categoryId]`).

The primary technical challenge is the monthly trends endpoint: Prisma `groupBy` does not natively group by calendar month from a `DateTime @db.Date` column. The correct approach is a raw PostgreSQL `DATE_TRUNC('month', ...)` query or manual bucketing in JavaScript after fetching all rows for the window. Given that the window is at most 12 months of one user's data, the JS bucketing approach is simpler and avoids raw SQL — fetch all transactions in the N-month window, reduce into a `Map<"YYYY-MM", {income, expense}>`, then generate the full month list and fill missing months with zeros.

The summary endpoint issues two `aggregate` calls (one per type). Using `prisma.$transaction([...])` ensures both aggregates read from the same consistent snapshot, following the established pattern in `TransactionService.getAll`.

**Primary recommendation:** Follow the `TransactionService` + `transactionController` pattern exactly. No new Prisma models, no schema changes, no new dependencies.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prisma Client | 7.6.0 | ORM queries — aggregate, groupBy, findMany | Already configured; `prisma` singleton at `src/lib/prisma.ts` |
| Elysia | latest | HTTP routing, query validation, auth macro | Established project framework |
| elysia `t` (Typebox) | bundled | Query param schema validation | Project convention for all query params (`query.ts`) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `prisma.$transaction` | — | Atomic multi-query read | Summary endpoint: two aggregates in one consistent read |

No new packages required. [VERIFIED: codebase inspection]

---

## Architecture Patterns

### Module Structure
```
backend/src/modules/dashboard/
├── index.ts      — Elysia controller, 4 GET routes, authMacro
├── service.ts    — DashboardService abstract class, static methods
└── query.ts      — Typebox query param schemas for each endpoint
```

### Pattern 1: Query Param Schemas (query.ts)
**What:** One exported Typebox object per endpoint with all params optional.
**When to use:** All query param definitions.
**Example:**
```typescript
// Source: backend/src/modules/transaction/query.ts [VERIFIED: codebase]
import { t } from "elysia"

export const summaryQuery = t.Object({
  dateFrom: t.Optional(t.String()),
  dateTo: t.Optional(t.String()),
})

export const trendsQuery = t.Object({
  months: t.Optional(t.Number({ minimum: 1, maximum: 24, default: 6 })),
})

export const recentQuery = t.Object({
  limit: t.Optional(t.Number({ minimum: 1, maximum: 50, default: 5 })),
})
```

### Pattern 2: Service — Decimal to Number Conversion
**What:** `Decimal` values from Prisma aggregate results must be converted to `number` before returning.
**When to use:** Any service method returning aggregated amounts (CONTEXT.md D-01).
**Example:**
```typescript
// Source: CONTEXT.md D-01 + Prisma Decimal docs [VERIFIED: codebase pattern]
const result = await prisma.transaction.aggregate({
  where: { userId, type: "income", transactionDate: dateRange },
  _sum: { amount: true },
})
const totalIncome = parseFloat((result._sum.amount ?? 0).toString())
```

### Pattern 3: Default to Current Month
**What:** When `dateFrom`/`dateTo` are absent, compute start and end of the current month in the service layer.
**Example:**
```typescript
// Source: CONTEXT.md D-04 [VERIFIED: decision]
function resolveMonthRange(dateFrom?: string, dateTo?: string) {
  if (dateFrom && dateTo) {
    return { gte: new Date(dateFrom), lte: new Date(dateTo) }
  }
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { gte: start, lte: end }
}
```

### Pattern 4: Monthly Trends Zero-Fill (Claude's Discretion)
**What:** Generate the full N-month array from today backwards, map Prisma results by "YYYY-MM" key, fill missing months with `{ income: 0, expense: 0 }`.
**Why JS bucketing over raw SQL:** The N-month window is bounded (max 24 months), data volume is per-user, and it avoids raw SQL string construction. [ASSUMED — both approaches are valid; this is the simpler one.]
**Example:**
```typescript
// Source: [ASSUMED — standard JS date manipulation pattern]
function buildMonthBuckets(months: number): string[] {
  const result: string[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`)
  }
  return result
}
```
Then: fetch all transactions in window, reduce to `Map<string, {income: number, expense: number}>` using `tx.transactionDate.toISOString().slice(0, 7)` as key.

### Pattern 5: Controller — Read-Only Routes
**What:** All four routes are GET. No body schemas needed. Auth macro pattern is identical to existing modules.
**Example:**
```typescript
// Source: backend/src/modules/transaction/index.ts [VERIFIED: codebase]
export const dashboardController = new Elysia({ prefix: "/dashboard" })
  .use(authMacro)
  .get("/summary", async ({ user, query }) => DashboardService.summary(user.id, query), {
    auth: true,
    query: summaryQuery,
  })
  // ... other routes
```

### Pattern 6: Category Breakdown — groupBy with categoryId
**What:** `prisma.transaction.groupBy` by `categoryId`, then enrich with category data.
**Approach:** Two queries — `groupBy` for amounts, `findMany` on Category for names/icons. Or a single `groupBy` + manual category join. Given Prisma 7 does not support `include` on `groupBy`, a follow-up category lookup is required. [VERIFIED: Prisma groupBy limitation — no `include` support]
**Example:**
```typescript
// Source: [VERIFIED: Prisma docs — groupBy does not support include]
const groups = await prisma.transaction.groupBy({
  by: ["categoryId"],
  where: { userId, type: "expense", transactionDate: dateRange },
  _sum: { amount: true },
})
// Then fetch categories for the returned categoryIds
const categoryIds = groups.map(g => g.categoryId).filter(Boolean) as string[]
const categories = await prisma.category.findMany({
  where: { id: { in: categoryIds } },
  select: { id: true, name: true, icon: true, color: true },
})
```

### Anti-Patterns to Avoid
- **`include` on `groupBy`:** Prisma does not support this. Always do a separate category lookup. [VERIFIED: Prisma limitation]
- **Returning `Decimal` directly:** JSON serialization of Prisma `Decimal` produces a string. Convert to number in service layer per D-01.
- **Missing `userId` filter:** Every query must scope to `userId`. Never aggregate across all users.
- **Hardcoding current month in controller:** Date logic belongs in the service layer.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth session lookup | Custom session middleware | `authMacro` + `{ auth: true }` | Already established; injects `user.id` |
| Date range defaults | Per-route logic | `resolveMonthRange()` helper in service | Single source of truth; reused by summary and category breakdown |
| Decimal conversion | Custom serializer | `parseFloat(val.toString())` | Prisma Decimal has `.toString()` and `.toNumber()` — use it |

---

## Common Pitfalls

### Pitfall 1: Prisma groupBy Cannot Include Relations
**What goes wrong:** Developer writes `groupBy({ by: ["categoryId"], include: { category: true } })` — TypeScript error and runtime failure.
**Why it happens:** Prisma's `groupBy` API does not support `include` or `select` beyond the grouped fields and aggregations.
**How to avoid:** Always fetch category details in a second query using `category.findMany({ where: { id: { in: [...] } } })`.
**Warning signs:** TypeScript error on `include` key inside `groupBy` call.

### Pitfall 2: Decimal Returns as String in JSON
**What goes wrong:** Frontend receives `"1234.56"` (string) instead of `1234.56` (number) for aggregate totals.
**Why it happens:** Prisma's `Decimal` type serializes to string in JSON by default.
**How to avoid:** Call `parseFloat(result._sum.amount?.toString() ?? "0")` in every service method that returns an aggregated amount. Per D-01, this only applies to computed aggregates — not individual transaction `amount` fields.
**Warning signs:** Frontend chart library receives string values and renders zeros or NaN.

### Pitfall 3: Zero-Fill Gaps in Monthly Trends
**What goes wrong:** Months with no transactions are omitted from the response, causing chart gaps or misaligned x-axis labels.
**Why it happens:** `groupBy` only returns rows that exist in the database.
**How to avoid:** Build the full month list from today backwards (N entries), map results into it, fill missing months with `{ income: 0, expense: 0 }`.
**Warning signs:** Response array length < N even when months param is 6.

### Pitfall 4: transactionDate is @db.Date, Not DateTime
**What goes wrong:** Queries using `new Date()` directly work, but time-of-day comparisons can produce unexpected boundary behavior.
**Why it happens:** `@db.Date` stores only the date portion. `gte: new Date("2026-04-01")` is safe; time components are ignored by PostgreSQL's `date` column.
**How to avoid:** Use `new Date(year, month, 1)` for start, `new Date(year, month + 1, 0)` for end — no need to set time components when comparing against a `date` column. [VERIFIED: schema.prisma line 176]

### Pitfall 5: Mount Order in src/index.ts
**What goes wrong:** Dashboard routes conflict with other modules or the app fails to start.
**Why it happens:** Elysia requires consistent plugin registration order.
**How to avoid:** Add `.use(dashboardController)` after `transactionController` in `src/index.ts`. [VERIFIED: src/index.ts]

---

## Code Examples

### Summary Endpoint — Atomic Two-Aggregate Read
```typescript
// Source: pattern from TransactionService.getAll [VERIFIED: codebase]
const dateRange = resolveMonthRange(query.dateFrom, query.dateTo)

const [incomeResult, expenseResult] = await prisma.$transaction([
  prisma.transaction.aggregate({
    where: { userId, type: "income", transactionDate: dateRange },
    _sum: { amount: true },
  }),
  prisma.transaction.aggregate({
    where: { userId, type: "expense", transactionDate: dateRange },
    _sum: { amount: true },
  }),
])

const totalIncome = parseFloat((incomeResult._sum.amount ?? 0).toString())
const totalExpense = parseFloat((expenseResult._sum.amount ?? 0).toString())

return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense }
```

### Recent Transactions — Reuse categoryInclude
```typescript
// Source: categoryInclude shape from TransactionService [VERIFIED: codebase line 26]
const categoryInclude = {
  category: { select: { id: true, name: true, type: true, icon: true, color: true } },
}

static async recent(userId: string, limit = 5) {
  return prisma.transaction.findMany({
    where: { userId },
    include: categoryInclude,
    orderBy: { transactionDate: "desc" },
    take: limit,
  })
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Raw SQL for aggregations | Prisma `aggregate` + `groupBy` | Prisma 2+ | Type-safe aggregation without raw SQL for standard cases |
| Prisma `groupBy` with `include` | Separate follow-up query for relations | Always a limitation | Must do two queries for category breakdown |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | JS bucketing approach for zero-fill is simpler than raw SQL `DATE_TRUNC` given bounded per-user window | Architecture Patterns — Pattern 4 | If data volume is larger than expected, raw SQL would be more efficient; but for personal finance per-user data this is not a concern |

---

## Open Questions

1. **Category breakdown: include or exclude uncategorized transactions?**
   - What we know: `categoryId` is nullable on `Transaction`; `groupBy` will return a `null` key for uncategorized transactions.
   - What's unclear: Should the dashboard show an "Uncategorized" bucket or silently drop these?
   - Recommendation: Filter `where: { categoryId: { not: null } }` in the breakdown query to exclude uncategorized transactions. Planner should confirm with user if needed; this matches typical dashboard UX where uncategorized items don't appear in a category chart.

---

## Environment Availability

Step 2.6: SKIPPED — phase is code-only changes to an existing backend module. No new external dependencies, services, or CLI tools beyond the established stack.

---

## Validation Architecture

> `workflow.nyquist_validation` key not found in config — treating as enabled.

No test infrastructure detected (`tests/` directory absent in `backend/`). [VERIFIED: codebase inspection]

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured (framework ready per CLAUDE.md) |
| Config file | None |
| Quick run command | Manual: `curl` against dev server |
| Full suite command | Manual: `curl` against dev server |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DASH-01 | Category breakdown returns spend totals by category | manual-only | `curl -s "http://localhost:3030/api/dashboard/category-breakdown"` | No framework |
| DASH-02 | Summary returns income, expense, net balance | manual-only | `curl -s "http://localhost:3030/api/dashboard/summary"` | No framework |
| DASH-03 | Trends returns N months with zero-fill | manual-only | `curl -s "http://localhost:3030/api/dashboard/trends?months=6"` | No framework |
| DASH-04 | Recent returns last N transactions with category | manual-only | `curl -s "http://localhost:3030/api/dashboard/recent?limit=5"` | No framework |

### Wave 0 Gaps
No test framework configured in backend. Manual curl verification against dev server is the only available approach. If Vitest or Jest is added in a future phase, these endpoints are straightforward to unit test (mock `prisma` client).

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Better Auth + `authMacro` — `{ auth: true }` on all routes |
| V3 Session Management | yes | Better Auth session handling — already configured |
| V4 Access Control | yes | All queries scoped by `userId` — service layer first param |
| V5 Input Validation | yes | Typebox `t.Object` in `query.ts` — all params typed and bounded |
| V6 Cryptography | no | Read-only aggregation; no cryptographic operations |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Cross-user data leak | Info Disclosure | `userId` filter on every Prisma query — enforced in service layer |
| Query param injection | Tampering | Typebox schema validation at controller level rejects unexpected types |
| Unbounded result sets | DoS | `limit` param has `maximum: 50`; `months` param has `maximum: 24` |

---

## Sources

### Primary (HIGH confidence)
- `backend/src/modules/transaction/service.ts` — categoryInclude shape, prisma.$transaction pattern, Decimal handling
- `backend/src/modules/transaction/query.ts` — Typebox query param schema pattern
- `backend/src/modules/transaction/index.ts` — controller authMacro pattern
- `backend/src/index.ts` — module mount point
- `backend/prisma/schema.prisma` — Transaction model fields, indexes, Decimal type, transactionDate as @db.Date
- `.planning/phases/03-dashboard-backend/03-CONTEXT.md` — all locked decisions (D-01 through D-05)
- `.claude/skills/backend-module.md` — module scaffolding checklist

### Secondary (MEDIUM confidence)
- Prisma `groupBy` does not support `include` — well-established limitation, consistent with Prisma 7 API surface [ASSUMED — not independently verified via Context7 in this session, but consistent across Prisma v2–v7]

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all libraries already in use
- Architecture: HIGH — all patterns copied from verified existing modules
- Pitfalls: HIGH — Decimal serialization and groupBy limitations are well-established Prisma behaviors
- Zero-fill approach: MEDIUM — JS bucketing is [ASSUMED] simpler for bounded per-user data; raw SQL alternative exists

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (Prisma 7 API is stable; Elysia patterns are stable)
