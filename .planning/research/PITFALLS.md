# Pitfalls Research

**Domain:** Personal expense/income tracker with future AI email extraction
**Researched:** 2026-04-04
**Confidence:** HIGH (stack-specific), MEDIUM (charting performance at scale)

---

## Critical Pitfalls

### Pitfall 1: Storing Amounts as Floats

**What goes wrong:**
`amount FLOAT` or `amount DOUBLE` in the database causes rounding errors. A user logs $10.10; after aggregation across 50 transactions the total drifts by a few cents. The UI shows a balance that doesn't match mental math.

**Why it happens:**
IEEE 754 floating-point cannot represent 0.1 exactly in binary. `0.1 + 0.2 === 0.30000000000000004` in JavaScript and similar precision loss occurs in SQL `FLOAT` columns.

**How to avoid:**
Store amounts as `DECIMAL(12,2)` (or `DECIMAL(19,4)` for future multi-currency support) in PostgreSQL — never `FLOAT` or `DOUBLE`. Prisma maps this with `@db.Decimal`. On the JavaScript side, never do arithmetic on the raw `Decimal` object from Prisma — use `Decimal.js` (already bundled with Prisma) or keep values as strings until display. Aggregate in SQL (`SUM`, `AVG`) rather than reducing in JavaScript.

**Warning signs:**
- `amount` field defined as `Float` in `schema.prisma` instead of `Decimal`
- JavaScript `reduce()` used to sum transaction amounts client-side
- Dashboard total doesn't match sum you'd do by hand

**Phase to address:** Transaction CRUD schema definition — before any data is written.

---

### Pitfall 2: Transaction Schema Not Ready for v2 AI Fields

**What goes wrong:**
v1 schema is designed for manual entry only (`amount`, `date`, `categoryId`, `note`). When v2 email extraction lands, a migration is needed to add `source` (manual vs email), `rawEmailId`, `aiConfidence`, `vendorRaw`, `pendingReview` flag. If these aren't nullable columns from day one, the migration will require backfilling every existing row.

**Why it happens:**
Premature optimization avoidance — developers build only what v1 needs and treat v2 as "a later problem."

**How to avoid:**
Add nullable columns for v2 at schema creation time. Specifically: `source String @default("manual")`, `pendingReview Boolean @default(false)`, `vendorName String?`, `rawEmailId BigInt?`. These cost nothing when null but eliminate a painful migration. The v2 `EmailLog`/`AiExtraction` tables already exist in the schema per CONCERNS.md — wire the FK from `Transaction` now.

**Warning signs:**
- `Transaction` model has no `source` or `pendingReview` field
- No FK from `Transaction` → `EmailLog` in schema
- v2 feature starts with "first we need to migrate the transactions table"

**Phase to address:** Transaction schema definition in Phase 1.

---

### Pitfall 3: Dashboard Queries Running Per-Request Without Indexes

**What goes wrong:**
Dashboard loads 4 charts: category breakdown, income vs expense balance, monthly trend, recent transactions. Without indexes, each chart triggers a full table scan filtered by `userId` + `date range`. At 1,000 transactions this is imperceptible; at 10,000+ it produces noticeable lag.

**Why it happens:**
Developers add indexes "later when it's slow." By then, production data exists and adding an index locks the table.

**How to avoid:**
Add composite indexes at schema creation time — the two that cover 90% of dashboard queries:
```
@@index([userId, date])        -- range queries for monthly/yearly views
@@index([userId, categoryId])  -- category breakdown aggregation
```
Additionally, run all four dashboard aggregations in a single Prisma `$transaction` call to avoid 4 round-trips. Use `groupBy` with `_sum` in Prisma rather than fetching all rows and summing in JavaScript.

**Warning signs:**
- `Transaction` model has no `@@index` directives beyond the PK
- Dashboard service makes 4 separate `prisma.transaction.findMany()` calls
- `SUM`/`GROUP BY` aggregation done in JavaScript after fetching raw rows

**Phase to address:** Transaction schema + dashboard query design (Phase 1 and dashboard phase).

---

### Pitfall 4: Chart Components Breaking SSR / Hydration

**What goes wrong:**
Recharts (used by shadcn charts and Tremor) uses browser APIs (`window`, `ResizeObserver`). Rendering a chart in a Next.js Server Component or without a `"use client"` boundary causes a hydration mismatch or outright crash during SSR.

**Why it happens:**
App Router defaults everything to Server Components. It's easy to forget to push `"use client"` down to the leaf that renders the chart.

**How to avoid:**
Isolate all chart components behind a `"use client"` boundary at the chart wrapper level, not the whole page. The page (`/dashboard/page.tsx`) stays a Server Component — it fetches data and passes serialized props to a `<DashboardCharts data={...} />` client component. Never use `dynamic(() => import(...), { ssr: false })` as a workaround — it defeats streaming.

**Warning signs:**
- `"use client"` at the top of the dashboard page file
- `dynamic` import with `ssr: false` for chart components
- Hydration error in browser console mentioning chart SVG elements

**Phase to address:** Dashboard UI phase.

---

### Pitfall 5: Fetching All Transactions to the Client for Filtering

**What goes wrong:**
"Recent transactions" list fetches every transaction for the user, then filters by date/category in JavaScript. Works fine for 50 rows; at 500 rows it's a slow initial load; at 5,000 rows it's a visible performance problem and a data-leak risk.

**Why it happens:**
Client-side filtering is easy to implement and feels responsive. Developers defer server-side filtering to "when we need it."

**How to avoid:**
Implement server-side filtering from day one. The transactions list endpoint must accept `?categoryId`, `?type` (income/expense), `?startDate`, `?endDate`, and `?page` query params. Return paginated results (default page size 20). This is easier to build once than to retrofit.

**Warning signs:**
- `GET /transactions` returns all transactions with no pagination
- Filter state is local React state that slices a `transactions` array
- `useQuery` key does not include active filter values

**Phase to address:** Transaction CRUD API design (Phase 1).

---

### Pitfall 6: Missing `userId` Guard on Every Transaction Operation

**What goes wrong:**
`GET /transactions/:id` returns the transaction if the ID exists — but doesn't verify it belongs to the authenticated user. User A can read or delete User B's transactions by guessing UUIDs.

**Why it happens:**
The category module (existing) already has this pattern right, but it's easy to forget when writing a new module quickly.

**How to avoid:**
Every Prisma query in `TransactionService` must include `where: { id, userId }` — never `where: { id }` alone. Follow the established pattern from `CategoryService`. Make this a code-review checklist item.

**Warning signs:**
- `prisma.transaction.findUnique({ where: { id } })` without `userId`
- Service methods accept `id` but not `userId` as parameters
- No test covering cross-user access

**Phase to address:** Transaction CRUD API (Phase 1) — non-negotiable before shipping.

---

### Pitfall 7: Conflating "Display Currency" with "Stored Amount"

**What goes wrong:**
Amount is stored as `1099` (integer cents) or formatted string `"10.99"` and the frontend displays it correctly. But when the user edits a transaction, the form pre-fills with `1099` or `"10.99"` and submits `10.99` — now the backend receives a different type depending on whether the value was touched. Subtle bugs around create vs. edit.

**Why it happens:**
No single source of truth for the wire format. Backend accepts both strings and numbers due to implicit coercion.

**How to avoid:**
Define one canonical format: store `DECIMAL(12,2)` in DB, serialize as a `string` in JSON responses (Prisma returns `Decimal` as string by default — keep it that way), accept string input on create/update. The frontend parses it once at display time using `Intl.NumberFormat`. Never send a JavaScript `number` for `amount` over the wire.

**Warning signs:**
- `amount` in API response is sometimes a number, sometimes a string
- `parseFloat(amount)` called on frontend before form pre-fill
- Edit form shows `1099` instead of `10.99`

**Phase to address:** Transaction API contract definition (Phase 1).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `Float` amount field | Simpler Prisma schema | Penny-rounding errors in totals, data migration required | Never |
| No pagination on `/transactions` | Simpler endpoint | Slow loads + data leak as rows grow | Never |
| Client-side filter/sort | Fast to implement | Re-fetch on every filter change defeats TanStack Query cache | Never for list endpoints |
| No `userId` index on Transaction | Cleaner schema | Full table scans grow linearly with all users' data | Never |
| Inline chart data aggregation in React | One fewer API call | Waterfalls RSC → client, exposes raw rows | Never |
| Skip `pendingReview`/`source` fields in v1 | Smaller schema now | Backfill migration + downtime when v2 ships | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Prisma `Decimal` type | Treating returned value as JS `number`, doing arithmetic on it | Use `.toNumber()` only at display time; aggregate in SQL |
| TanStack React Form + Zod v4 | Defining `amount` as `z.number()` — coerces string input to float | Use `z.string()` with `.refine()` for valid decimal format, parse server-side |
| shadcn chart (Recharts) | Placing in Server Component | Wrap in `"use client"` component that receives pre-aggregated data as props |
| Better Auth session in App Router | Calling `auth.api.getSession()` inside a `useEffect` (client-side) | Use `auth.api.getSession({ headers: headers() })` in Server Component or middleware |
| PostgreSQL `DECIMAL` via `@prisma/adapter-pg` | Expecting `number` type in response | `pg` driver returns `Decimal` as string — handle consistently |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| No composite index on `(userId, date)` | Dashboard monthly trend query is slow | Add `@@index([userId, date])` at schema creation | ~5,000 transactions per user |
| 4 separate DB round-trips for dashboard | Dashboard takes 400–800ms to load | Wrap in `prisma.$transaction([...])` parallel queries | Every request |
| Fetching full transaction rows for aggregation | High memory, slow `GROUP BY` in JS | Use `prisma.transaction.groupBy()` with `_sum` | ~1,000 rows |
| Chart re-renders on every keystroke in filter | UI jank when typing in search/filter | Debounce filter input 300ms before invalidating query | Immediately noticeable |
| Missing `Suspense` on dashboard charts | Entire page blocks until all charts load | Wrap each chart section in `<Suspense fallback={<Skeleton />}>` | Always — affects perceived performance |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| `findUnique({ where: { id } })` without `userId` | IDOR — any user can read/delete any transaction | Always include `userId` in `where` clause |
| Accepting `userId` from request body | User spoofs another user's ID | Always derive `userId` from session, never from input |
| No rate limiting on transaction create | Spam/abuse — thousands of fake transactions | Add per-user rate limit (e.g., 100 creates/min via Elysia middleware) |
| Returning full transaction object including internal fields | Exposes `rawEmailId`, AI confidence scores | Use explicit `select` or a response DTO to whitelist fields |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing raw decimal `10.99000` | Looks broken, untrustworthy | Always format with `Intl.NumberFormat` locale-aware before display |
| Dashboard defaults to all-time view | Charts are unreadable with many months | Default to current month; persist user's last selected range in URL params |
| Delete transaction with no confirmation | Accidental data loss with no recovery | Confirmation dialog (already pattern in codebase from auth); no soft-delete needed for v1 |
| Form resets on validation error | User loses all input re-typing | TanStack Form preserves field state on error — don't reset the form store |
| Negative amounts for expenses | Confusing balance math (`-50 + -30 = -80`) | Store all amounts as positive; use `type` field (`expense`/`income`) to determine sign in calculations |

---

## "Looks Done But Isn't" Checklist

- [ ] **Transaction CRUD:** Amount field is `Decimal` in schema, not `Float` or `Int` — verify `schema.prisma`
- [ ] **Transaction CRUD:** Every service method filters by `userId` — verify no `findUnique({ where: { id } })` alone
- [ ] **Transaction schema:** `source`, `pendingReview`, `vendorName`, `rawEmailId` nullable fields exist for v2 readiness
- [ ] **Dashboard queries:** Composite indexes `(userId, date)` and `(userId, categoryId)` declared in schema
- [ ] **Dashboard charts:** All chart wrapper components have `"use client"` — verify no hydration errors in browser
- [ ] **Transactions list:** Endpoint accepts pagination + filter params — verify `GET /transactions?page=1&categoryId=x` works
- [ ] **Amount wire format:** API response `amount` is always a string — verify no silent `number` coercion in Elysia serialization

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Float amount in DB | HIGH | Migrate column to `DECIMAL`, recalculate all stored totals, audit for rounding drift |
| No v2 fields in schema | MEDIUM | Add nullable columns in one migration, no backfill needed if nullable with defaults |
| IDOR on transaction reads | HIGH | Audit all service methods, add `userId` guards, rotate any exposed transaction IDs |
| Missing indexes | LOW | Add `@@index` to schema, run `prisma db push` — PostgreSQL adds indexes online |
| Charts in Server Components | LOW | Move to `"use client"` wrapper — purely structural refactor |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Float amounts | Phase 1 — Transaction schema | `schema.prisma` shows `Decimal @db.Decimal(12,2)` |
| v2 schema unreadiness | Phase 1 — Transaction schema | `Transaction` model has `source`, `pendingReview`, `vendorName?`, `rawEmailId?` |
| Missing indexes | Phase 1 — Transaction schema | `@@index([userId, date])` and `@@index([userId, categoryId])` present |
| IDOR on transactions | Phase 1 — Transaction API | Code review: every query includes `userId` |
| Amount wire format confusion | Phase 1 — Transaction API contract | API test: response `amount` is string, edit pre-fill shows `"10.99"` |
| Fetching all rows for filter | Phase 1 — Transaction list endpoint | `GET /transactions` requires page param; returns max 20 rows |
| Chart SSR hydration | Phase 2 — Dashboard UI | Zero hydration errors in browser console on dashboard load |
| Dashboard N+1 round-trips | Phase 2 — Dashboard queries | Network tab shows 1 dashboard request, not 4 |
| No Suspense on charts | Phase 2 — Dashboard UI | Dashboard page renders skeleton during chart data load |

---

## Sources

- [Financial Precision in JavaScript — DEV Community](https://dev.to/benjamin_renoux/financial-precision-in-javascript-handle-money-without-losing-a-cent-1chc)
- [Currency Calculations in JavaScript — Honeybadger](https://www.honeybadger.io/blog/currency-money-calculations-in-javascript/)
- [Dinero.js — Money as integers in minor units](https://www.dinerojs.com/)
- [Next.js App Router common mistakes — Upsun](https://upsun.com/blog/avoid-common-mistakes-with-next-js-app-router/)
- [6 React Server Component performance pitfalls — LogRocket](https://blog.logrocket.com/react-server-components-performance-mistakes)
- [Next.js 16 App Router production patterns — ECOSIRE](https://ecosire.com/blog/nextjs-16-app-router-production)
- [Prisma aggregation, grouping, summarizing — official docs](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing)
- [Prisma query optimization — official docs](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)
- [Recharts performance with large datasets — Medium comparison](https://medium.com/@ponshriharini/comparing-8-popular-react-charting-libraries-performance-features-and-use-cases-cc178d80b3ba)
- Codebase CONCERNS.md — existing race conditions, CSRF gaps, N+1 potential (internal audit 2026-04-04)

---
*Pitfalls research for: personal expense/income tracker (Kashin)*
*Researched: 2026-04-04*
