# Architecture Research

**Domain:** Personal finance tracker (transaction CRUD + dashboard)
**Researched:** 2026-04-04
**Confidence:** HIGH (schema patterns), MEDIUM (index specifics — verified via PostgreSQL docs + community patterns)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
├──────────────┬──────────────┬──────────────────────────────-┤
│  Dashboard   │  Transaction │  Category (existing)           │
│  Feature     │  Feature     │                                │
│  /features/  │  /features/  │                                │
│  dashboard/  │  transaction/│                                │
└──────┬───────┴──────┬───────┴────────────────────────────────┘
       │ TanStack Query│ (Axios, withCredentials)
┌──────▼───────────────▼──────────────────────────────────────┐
│                    Elysia API (port 3030)                     │
├──────────────┬──────────────────────────────────────────────┤
│  /modules/   │  /modules/dashboard/  (aggregation queries)   │
│  transaction/│  (GET only, no mutations)                     │
│  (CRUD)      │                                                │
└──────┬───────┴──────────────────────────────────────────────┘
       │ Prisma 7 + @prisma/adapter-pg
┌──────▼──────────────────────────────────────────────────────┐
│                       PostgreSQL                             │
│  transactions table  │  categories table (existing)          │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `transaction` module | CRUD: create, read, update, delete transactions | `backend/src/modules/transaction/` |
| `dashboard` module | Aggregation queries: monthly totals, category breakdown, balance | `backend/src/modules/dashboard/` |
| `transaction` feature | Form, list, filters, pagination UI | `frontend/src/features/transaction/` |
| `dashboard` feature | Charts, summary cards, recent list | `frontend/src/features/dashboard/` |

## Transaction Schema

### Core Prisma Model

```prisma
model Transaction {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String    @db.Uuid
  categoryId  String    @db.Uuid
  type        TransactionType   // "EXPENSE" | "INCOME"
  amount      Decimal   @db.Decimal(12, 2)
  date        DateTime  @db.Date         // user-specified date (not createdAt)
  note        String?
  vendor      String?

  // v2 fields — add now, cost is zero, avoids migration pain later
  status      TransactionStatus @default(CONFIRMED)
  source      TransactionSource @default(MANUAL)
  aiRawData   Json?             // raw AI extraction payload, nullable

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@index([userId, date(sort: Desc)])           // primary listing query
  @@index([userId, categoryId, date(sort: Desc)]) // category filter + chart
  @@index([userId, status])                     // v2 pending queue
  @@map("transactions")
}

enum TransactionType {
  EXPENSE
  INCOME
}

enum TransactionStatus {
  PENDING    // v2: AI-extracted, awaiting user review
  CONFIRMED  // live transaction (default for manual)
}

enum TransactionSource {
  MANUAL     // user typed it in
  EMAIL_AI   // v2: extracted from forwarded email
}
```

**Why `date` as `@db.Date` (not `DateTime`):** Users record a transaction date (e.g., "Jan 5"), not a timestamp. Using `Date` avoids timezone ambiguity in monthly aggregations. Store in UTC; display as-is.

**Why `Decimal(12, 2)` not `Float`:** Floating-point arithmetic is unsafe for money. Prisma maps `Decimal` to PostgreSQL `NUMERIC(12,2)` which is exact. Supports up to $9,999,999,999.99 — sufficient for personal use. [MEDIUM confidence — standard fintech convention, not formally benchmarked for this scale]

**Why `aiRawData Json?`:** Stores the raw AI extraction payload for debugging and reprocessing. Nullable — only populated in v2. No migration needed when v2 ships.

### Index Strategy

| Index | Query It Serves | Why |
|-------|----------------|-----|
| `(userId, date DESC)` | Transaction list, monthly trends | Primary filter for all user queries |
| `(userId, categoryId, date DESC)` | Category breakdown chart, filtered list | Covers category + date range lookups |
| `(userId, status)` | v2 pending queue | Fast filter for unconfirmed AI imports |

**Important:** All dashboard aggregation queries must include `status = 'CONFIRMED'` in the WHERE clause so pending v2 entries never pollute reports. Add this from day one even though v1 only creates CONFIRMED records.

BRIN indexes are not recommended here — BRIN excels when physical row order matches insert order (append-only logs). Transactions have user-specified `date` values that don't follow insert order. Standard B-tree indexes are correct. [HIGH confidence — PostgreSQL documentation]

## Dashboard Query Patterns

All queries filter `WHERE userId = $1 AND status = 'CONFIRMED'`.

### Monthly spending trend (last N months)
```sql
SELECT
  DATE_TRUNC('month', date) AS month,
  type,
  SUM(amount) AS total
FROM transactions
WHERE userId = $1
  AND status = 'CONFIRMED'
  AND date >= DATE_TRUNC('month', NOW()) - INTERVAL '5 months'
GROUP BY 1, 2
ORDER BY 1;
```
Covered by `(userId, date DESC)` index. PostgreSQL partial scan returns only 6 months of rows.

### Category breakdown (current month)
```sql
SELECT
  c.name,
  c.color,
  SUM(t.amount) AS total
FROM transactions t
JOIN categories c ON c.id = t.categoryId
WHERE t.userId = $1
  AND t.status = 'CONFIRMED'
  AND t.type = 'EXPENSE'
  AND t.date >= DATE_TRUNC('month', NOW())
GROUP BY c.id, c.name, c.color
ORDER BY total DESC;
```
Covered by `(userId, categoryId, date DESC)` index.

### Income vs expense balance (current month)
```sql
SELECT
  type,
  SUM(amount) AS total
FROM transactions
WHERE userId = $1
  AND status = 'CONFIRMED'
  AND date >= DATE_TRUNC('month', NOW())
GROUP BY type;
```
Covered by `(userId, date DESC)` index.

**No materialized views needed at personal-use scale.** A single user's transaction table will not exceed tens of thousands of rows in years. Raw aggregation queries are fast. Introduce materialized views only if multi-user SaaS scale is ever needed.

## Recommended Project Structure

```
backend/src/modules/
├── transaction/
│   ├── index.ts        # Elysia controller: CRUD routes
│   ├── service.ts      # TransactionService static methods
│   └── query.ts        # Typebox schemas for query params (filters, pagination)
└── dashboard/
    ├── index.ts        # Elysia controller: GET-only aggregation routes
    └── service.ts      # DashboardService — aggregation queries via Prisma $queryRaw

frontend/src/features/
├── transaction/
│   ├── api/            # TanStack Query options (list, create, update, delete)
│   ├── components/     # TransactionForm, TransactionList, TransactionFilters
│   ├── hooks/          # useTransactionFilters (nuqs state)
│   └── validations/    # Zod v4 schemas
└── dashboard/
    ├── api/            # TanStack Query options (summary, monthly, category)
    ├── components/     # BalanceCard, MonthlyChart, CategoryChart, RecentList
    └── types/          # Dashboard DTO types
```

### Structure Rationale

- **Separate `dashboard` module from `transaction`:** Dashboard is read-only aggregation; transaction is CRUD. Mixing them violates single responsibility and makes the service layer messy.
- **`query.ts` in transaction module:** Follows the category module pattern for filter/pagination query param schemas (Typebox, not prismabox).
- **`$queryRaw` for dashboard aggregations:** Prisma's `groupBy` is functional but verbose for multi-column aggregations with JOINs. `$queryRaw` is clearer and more performant for the specific SQL needed. Prisma types the return as `unknown[]` — define explicit return types in service.

## Architectural Patterns

### Pattern 1: Status-Gated Visibility

**What:** All queries that produce user-visible data include `status = 'CONFIRMED'`. The `PENDING` status gates v2 AI entries from appearing in reports until confirmed.

**When to use:** Any query that feeds the dashboard, transaction list, or exports.

**Trade-offs:** One extra WHERE clause everywhere. Cost is zero at this scale; benefit is v2 ships without schema migration.

### Pattern 2: Separate Dashboard Service

**What:** `DashboardService` owns all aggregation queries. `TransactionService` owns only CRUD. Dashboard never writes; Transaction never aggregates.

**When to use:** Always — even in v1 with simple queries.

**Trade-offs:** Extra file, extra controller. Worth it: dashboard query complexity grows with features (charts, filters, date ranges) and would pollute a combined service.

### Pattern 3: `date` field as user intent, `createdAt` as audit trail

**What:** `date` stores when the transaction occurred (user-specified). `createdAt` stores when the record was created (system-set). Group-by `date` in all aggregations, never `createdAt`.

**When to use:** Always. This is the only correct pattern for financial records where users backfill transactions.

## Data Flow

### Create Transaction (v1 Manual)
```
User fills TransactionForm (Zod validation)
    ↓
mutation: POST /api/transaction
    ↓
Elysia controller validates body (prismabox)
    ↓
Auth macro injects userId
    ↓
TransactionService.create(userId, body)
  → prisma.transaction.create({ data: { ...body, userId, status: 'CONFIRMED', source: 'MANUAL' } })
    ↓
201 response → invalidate ["transactions"] and ["dashboard"] cache keys
```

### Create Transaction (v2 AI — future)
```
Email received by ingestion service
    ↓
AI extracts: vendor, amount, date, suggestedCategory
    ↓
TransactionService.createPending(userId, aiPayload)
  → status: 'PENDING', source: 'EMAIL_AI', aiRawData: rawPayload
    ↓
In-app notification badge increments
    ↓
User reviews pending queue → confirms or edits
    ↓
TransactionService.confirm(id, userId, finalData)
  → status: 'CONFIRMED', category resolved to user's categoryId
```

### Dashboard Load
```
User navigates to /dashboard
    ↓
3 parallel TanStack queries (staleTime from global QueryClient config):
  - GET /api/dashboard/summary   → balance card data
  - GET /api/dashboard/monthly   → monthly trend chart
  - GET /api/dashboard/categories → category breakdown chart
    ↓
DashboardService executes $queryRaw aggregations
All include WHERE status = 'CONFIRMED'
    ↓
Charts render with Recharts/shadcn chart components
```

## Build Order

**Phase 1 — Transaction CRUD backend:**
1. Add `Transaction` model to Prisma schema (with v2 fields)
2. Run `bunx --bun prisma db push`
3. Build `TransactionService` (create, list, getById, update, delete)
4. Build `transactionController` (CRUD routes, auth macro, prismabox validation)

**Phase 2 — Transaction CRUD frontend:**
5. Build Zod schemas + TanStack Query options
6. Build `TransactionForm` (create/edit)
7. Build `TransactionList` with filters (type, category, date range via nuqs)

**Phase 3 — Dashboard backend:**
8. Build `DashboardService` with 3 aggregation queries
9. Build `dashboardController` (GET-only routes)

**Phase 4 — Dashboard frontend:**
10. Build dashboard feature: BalanceCard, MonthlyChart, CategoryChart, RecentList

**Rationale for this order:** Backend-first per phase ensures frontend is never blocked on missing APIs. CRUD before dashboard because charts need data to be useful and testable.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1 user, personal use | Current approach is correct. No changes needed. |
| 100-1k users (future SaaS) | Add `EXPLAIN ANALYZE` monitoring; consider connection pooling via PgBouncer |
| 10k+ users | Materialized views for dashboard aggregations refreshed on cron; read replica for dashboard queries |

### Scaling Priorities

1. **First bottleneck:** Dashboard aggregations on large transaction tables. Fix: materialized views.
2. **Second bottleneck:** Connection count. Fix: PgBouncer (already recommended for Prisma + PostgreSQL in production).

## Anti-Patterns

### Anti-Pattern 1: Using `createdAt` for aggregations

**What people do:** `GROUP BY DATE_TRUNC('month', "createdAt")` because it's always present.

**Why it's wrong:** If a user enters last month's grocery receipt today, it appears in this month's report. Financial data must group by when the transaction occurred, not when it was recorded.

**Do this instead:** Always aggregate on `date` (the user-intent field).

### Anti-Pattern 2: Storing amount as Float

**What people do:** `amount Float` in Prisma because it's simpler.

**Why it's wrong:** IEEE 754 floating-point cannot represent most decimal values exactly. `0.1 + 0.2 = 0.30000000000000004`. Summing hundreds of expenses will drift. Never use floats for money.

**Do this instead:** `amount Decimal @db.Decimal(12, 2)`. Prisma returns this as a `Decimal` object (from `decimal.js`); serialize to string for JSON transport, parse on frontend.

### Anti-Pattern 3: Adding v2 AI fields later via migration

**What people do:** Ship v1 with a minimal schema, add `status`, `source`, `aiRawData` in a v2 migration.

**Why it's wrong:** Adding nullable columns to large tables in PostgreSQL requires a full table rewrite in older versions (mitigated in PG 11+ for nullable columns, but still adds migration risk and deploy complexity).

**Do this instead:** Add all v2 nullable fields now with sensible defaults (`status = CONFIRMED`, `source = MANUAL`, `aiRawData = null`). Zero cost in v1; v2 ships without schema migration.

### Anti-Pattern 4: Merging dashboard and transaction controllers

**What people do:** Add `GET /api/transaction/summary` to the transaction controller.

**Why it's wrong:** Dashboard endpoints are fundamentally different in nature (read-only, aggregation, multi-table) and will grow independently. Mixing them makes the transaction controller a kitchen-sink module.

**Do this instead:** Separate `dashboardController` and `DashboardService` from day one.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `transaction` module ↔ `dashboard` module | None — dashboard reads DB directly | Dashboard never calls TransactionService; both talk to Prisma independently |
| `transaction` module ↔ `category` module | FK constraint in DB only | No service-to-service calls; categoryId validated by DB FK on insert |
| v2 AI ingestion ↔ `transaction` module | `TransactionService.createPending()` | Ingestion service (future) calls same service layer, status = PENDING |

### External Services (v2+)

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Email ingestion (v2) | Inbound email webhook → ingestion service → TransactionService | Keep ingestion as separate module; do not pollute transaction module |
| Stripe (v3) | Webhook handler + subscription gating middleware | Separate `billing` module; gate features via user plan field on User model |

## Sources

- PostgreSQL documentation on index types and B-tree vs BRIN: [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- PostgreSQL NUMERIC type for financial data: [PostgreSQL Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)
- Prisma soft delete and partial index patterns: [This Dot Labs — Soft Delete with Prisma](https://www.thisdot.co/blog/how-to-implement-soft-delete-with-prisma-using-partial-indexes)
- Prisma Decimal type documentation: [Prisma Decimal](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#decimal)
- PostgreSQL analytics optimization: [OneUptime — Optimize PostgreSQL for Analytics](https://oneuptime.com/blog/post/2026-01-25-optimize-postgresql-analytics-workloads/view)

---
*Architecture research for: personal finance tracker (transaction + dashboard)*
*Researched: 2026-04-04*
