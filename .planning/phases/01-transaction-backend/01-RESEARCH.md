# Phase 1: Transaction Backend - Research

**Researched:** 2026-04-04
**Domain:** Elysia + Prisma 7 backend module — transaction CRUD with filtering, pagination, search, and bulk delete
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Amount serialization:** Return `amount` as a string in all JSON responses. Prisma's `Decimal` type serializes to string by default — do not call `.toNumber()`. Applies to every endpoint that returns transaction data.

**Pagination:** Offset/limit only. Query params: `page` (default 1) + `limit` (default 20). Response envelope:
```json
{ "data": Transaction[], "total": number, "page": number, "limit": number, "totalPages": number }
```

**Category nesting:** Include a nested category object on every transaction response:
```json
{ "category": { "id": "...", "name": "Food", "type": "expense", "icon": "🍔", "color": "#ff5733" } }
```
When `categoryId` is null, `category` is `null`. Use `include: { category: { select: { id, name, type, icon, color } } }`.

**categoryId optionality:**
- Create: `categoryId` may be omitted → saved with `category: null`
- Update: `categoryId` may be omitted → existing value unchanged (patch semantics)

### Claude's Discretion

None specified.

### Deferred Ideas (OUT OF SCOPE)

None surfaced during discussion.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TXN-01 | User can create a transaction with type, amount, date, category, and optional description/notes | `TransactionPlainInputCreate` exists in prismabox; `categoryId` must be added manually to body schema since prismabox generates it only in `TransactionRelationsInputCreate`. Controller uses POST `/transaction`, service calls `prisma.transaction.create` with `userId` + `categoryId`. |
| TXN-02 | User can edit any of their own transactions | PUT `/:id` follows category update pattern. Patch semantics: `categoryId` omitted = keep existing; to clear category, send `categoryId: null`. Use `prisma.transaction.update({ where: { id, userId } })`. |
| TXN-03 | User can delete a transaction | DELETE `/:id` — check existence with `findUnique({ where: { id, userId } })`, throw `NotFoundError` if absent, then delete. |
| TXN-04 | User can view transaction list filtered by date range, type, and/or category | Custom `getAllQuery` typebox schema with optional `type`, `categoryId`, `dateFrom`, `dateTo`, `page`, `limit`. Service builds Prisma `where` conditionally. Default `orderBy: { transactionDate: "desc" }`. |
| TXN-05 | User can search transactions by description or notes text | Add optional `search` query param; Prisma `where: { OR: [{ description: { contains: search, mode: "insensitive" } }, { notes: { contains: search, mode: "insensitive" } }] }`. |
| TXN-06 | User can bulk-delete multiple selected transactions | POST `/transaction/bulk-delete` with body `{ ids: string[] }` — custom body schema (not prismabox). Service calls `prisma.transaction.deleteMany({ where: { id: { in: ids }, userId } })`. |
</phase_requirements>

---

## Summary

Phase 1 implements the Transaction backend module following the established category module pattern: `query.ts` (Typebox query params) + `service.ts` (abstract static class) + `index.ts` (Elysia controller). The Prisma schema is already complete and v2-ready — no schema changes are needed. The prismabox-generated `TransactionPlainInputCreate` and `TransactionPlainInputUpdate` exist and are usable, but neither includes `categoryId` in the plain input (it lives in `TransactionRelationsInputCreate`). The planner must design custom body schemas that extend the plain inputs with an optional `categoryId` field.

The most complex departures from the category pattern are: (1) the paginated list response requires a wrapper envelope rather than a bare array; (2) `categoryId` must flow through as a direct FK field (not Prisma relation syntax) because the controller owns user scoping; (3) bulk-delete needs a dedicated route with a custom Typebox array body schema. The `amount` field in `TransactionPlainInputCreate` is typed `t.Number()` by prismabox — the controller must accept numbers on input but Prisma will store and return them as `Decimal` strings automatically.

**Primary recommendation:** Follow the category module structure exactly, extend with custom `query.ts` for pagination/filter params, write custom body schemas for create/update/bulk-delete that include `categoryId` as `t.Optional(__nullable__(t.String()))`, and wrap the list response in the pagination envelope inside the service.

---

## Standard Stack

### Core (all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Elysia | latest (project) | HTTP routing, validation, response | Established project framework |
| Prisma | 7.6.0 | ORM, query builder, type generation | Established project ORM |
| prismabox | 1.1.26 | Auto-generated Typebox schemas from Prisma | Project standard for body validation |
| @prisma/adapter-pg | 7.6.0 | PostgreSQL adapter | Project standard |
| Better Auth (macro) | 1.5.6 | Auth guard via `authMacro` | Project standard |

No new packages needed. All dependencies are in place.

---

## Architecture Patterns

### Module File Structure

```
backend/src/modules/transaction/
├── index.ts      — Elysia controller, route definitions, auth guards
├── service.ts    — TransactionService abstract class, static methods
└── query.ts      — Typebox schemas for all query params
```

### Pattern 1: Custom body schema for create (categoryId gap)

`TransactionPlainInputCreate` from prismabox does NOT include `categoryId` — that field lives in `TransactionRelationsInputCreate` under a Prisma relation syntax. For the API, `categoryId` must be a plain string FK. Extend the plain input inline in the controller:

```typescript
// In index.ts — custom body schema
import { t } from "elysia"
import { TransactionPlainInputCreate } from "../../generated/prismabox/Transaction"

const transactionCreateBody = t.Composite([
  TransactionPlainInputCreate,
  t.Object({ categoryId: t.Optional(__nullable__(t.String())) }),
])
```

Same approach for update body.

### Pattern 2: Paginated list service method

```typescript
static async getAll(userId: string, query: GetAllQueryType) {
  const { page = 1, limit = 20, type, categoryId, dateFrom, dateTo, search } = query
  const skip = (page - 1) * limit

  const where = {
    userId,
    ...(type ? { type } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(dateFrom || dateTo ? {
      transactionDate: {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      }
    } : {}),
    ...(search ? {
      OR: [
        { description: { contains: search, mode: "insensitive" as const } },
        { notes: { contains: search, mode: "insensitive" as const } },
      ]
    } : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, name: true, type: true, icon: true, color: true } } },
      orderBy: { transactionDate: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ])

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}
```

### Pattern 3: Bulk-delete route

```typescript
// In index.ts
.post("/bulk-delete", async ({ user, body }) => TransactionService.bulkDelete(user.id, body.ids), {
  auth: true,
  body: t.Object({ ids: t.Array(t.String(), { minItems: 1 }) }),
})
```

```typescript
// In service.ts
static async bulkDelete(userId: string, ids: string[]) {
  return prisma.transaction.deleteMany({
    where: { id: { in: ids }, userId },
  })
}
```

### Pattern 4: categoryId on update (patch semantics)

```typescript
static async update(userId: string, id: string, input: UpdateInputType) {
  const exists = await prisma.transaction.findUnique({ where: { id, userId } })
  if (!exists) throw new NotFoundError("Transaction doesn't exist")

  const { categoryId, ...rest } = input
  return prisma.transaction.update({
    where: { id, userId },
    data: {
      ...rest,
      // Only update categoryId if explicitly provided
      ...(categoryId !== undefined ? { categoryId } : {}),
    },
    include: { category: { select: { id: true, name: true, type: true, icon: true, color: true } } },
  })
}
```

### Anti-Patterns to Avoid

- **Calling `.toNumber()` on Decimal fields:** Prisma returns `Decimal` objects that serialize to strings. Calling `.toNumber()` loses precision. Never convert amount.
- **Using `TransactionRelationsInputCreate` for the body schema:** It uses Prisma relation connect syntax — not suitable for a REST API accepting plain IDs.
- **Not scoping by `userId` in deleteMany:** `prisma.transaction.deleteMany({ where: { id: { in: ids } } })` without `userId` allows cross-user deletion. Always include `userId` in the where clause.
- **Returning bare array from list endpoint:** The locked decision requires the pagination envelope — never return a raw array from GET `/transaction`.
- **Omitting `include: { category }` on create/update responses:** The locked decision requires category object on ALL transaction responses, including create and update.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Request body validation | Custom validator | prismabox `TransactionPlainInputCreate` + custom `t.Object` extension | Elysia validates at HTTP layer automatically |
| Prisma count + findMany atomicity | Two separate queries | `prisma.$transaction([findMany, count])` | Ensures consistent page totals |
| Auth guard | Session check in every handler | `authMacro` + `{ auth: true }` | Project-standard macro already built |
| 404 on missing transaction | Custom error class | Elysia's `NotFoundError` | Maps to 404 automatically |

---

## Common Pitfalls

### Pitfall 1: prismabox `amount` typed as `t.Number()` — input vs output mismatch

**What goes wrong:** `TransactionPlainInputCreate` types `amount` as `t.Number()`. Elysia validates the incoming request body as a number. Prisma stores it as `DECIMAL(15,2)` and returns a `Decimal` object that JSON-serializes to a string. The controller receives a number, stores it, and returns a string — this is correct and expected. Do not try to force consistency by converting the Decimal to a number on output.

**How to avoid:** Accept `t.Number()` on input (prismabox default), return string on output (Prisma default). No conversion needed in either direction.

### Pitfall 2: `transactionDate` is `@db.Date` — time component stripped

**What goes wrong:** `transactionDate` is a PostgreSQL `DATE` column (not `TIMESTAMP`). Prisma returns it as a `Date` object with the time set to midnight UTC. If the frontend sends a full ISO datetime string, Prisma strips the time on write. This is intentional — store date only.

**How to avoid:** Frontend should send ISO date strings like `"2024-01-15"`. On the query side, `dateFrom`/`dateTo` string params should be parsed with `new Date(dateFrom)` — Prisma handles the date comparison correctly.

### Pitfall 3: `categoryId` not in prismabox plain input schemas

**What goes wrong:** Developer imports `TransactionPlainInputCreate` and wonders why `categoryId` is not validated — client sends it, Elysia strips it silently because `additionalProperties: false` is set on the schema. The transaction is saved with `category: null` even when the client sent a valid `categoryId`.

**How to avoid:** Always extend the create/update body schemas with `t.Object({ categoryId: t.Optional(__nullable__(t.String())) })` via `t.Composite`.

### Pitfall 4: `deleteMany` returns count, not records

**What goes wrong:** `prisma.transaction.deleteMany(...)` returns `{ count: number }`, not the deleted records. If the frontend expects the deleted IDs back, this response is incomplete.

**How to avoid:** Return the `deleteMany` result directly — the frontend should use the original `ids` array it sent. Document the response shape clearly.

### Pitfall 5: Text search on `notes` field — case sensitivity

**What goes wrong:** PostgreSQL `LIKE` is case-sensitive by default. Using `contains: search` without `mode: "insensitive"` misses mixed-case matches.

**How to avoid:** Always set `mode: "insensitive" as const` on `contains` filters for description and notes. The `as const` cast is needed to satisfy Prisma's TypeScript type (`"insensitive" | "default"`).

---

## Code Examples

### query.ts — full transaction query schema

```typescript
import { t } from "elysia"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
  categoryId: t.Optional(t.String()),
  dateFrom: t.Optional(t.String()),   // ISO date string "YYYY-MM-DD"
  dateTo: t.Optional(t.String()),     // ISO date string "YYYY-MM-DD"
  search: t.Optional(t.String()),
})
```

### Controller mount in src/index.ts

```typescript
import { transactionController } from "./modules/transaction"
// Add to chain:
.use(transactionController)
```

---

## Environment Availability

Step 2.6: SKIPPED — Phase 1 is a pure backend code addition. No external tools, services, or CLIs are required beyond the existing Bun + PostgreSQL stack, which is already running.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Not yet configured (framework ready for Jest/Vitest per CLAUDE.md) |
| Config file | None — Wave 0 gap |
| Quick run command | `bun test` (Bun built-in test runner, zero config) |
| Full suite command | `bun test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TXN-01 | Create transaction with type, amount, date, category | unit | `bun test src/modules/transaction/service.test.ts` | Wave 0 |
| TXN-02 | Update own transaction; 404 on other user's | unit | `bun test src/modules/transaction/service.test.ts` | Wave 0 |
| TXN-03 | Delete own transaction; 404 if not found | unit | `bun test src/modules/transaction/service.test.ts` | Wave 0 |
| TXN-04 | List with filters (type, category, date range) | unit | `bun test src/modules/transaction/service.test.ts` | Wave 0 |
| TXN-05 | Search by description/notes, case-insensitive | unit | `bun test src/modules/transaction/service.test.ts` | Wave 0 |
| TXN-06 | Bulk-delete by IDs, scoped to userId | unit | `bun test src/modules/transaction/service.test.ts` | Wave 0 |

> Note: Given no test infrastructure exists yet, these are targets for Wave 0. The planner should decide whether to include test scaffolding or mark validation as manual (dev server smoke test) given the project's current zero-test state.

### Sampling Rate

- **Per task commit:** Manual smoke test via `bun run dev` + curl/HTTP client
- **Per wave merge:** Same (no automated suite yet)
- **Phase gate:** All endpoints respond correctly before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `backend/src/modules/transaction/service.test.ts` — covers TXN-01 through TXN-06 (if tests are in scope for this phase)
- [ ] Test DB setup (separate test database or mocking strategy) — required before any Prisma unit tests run

---

## Sources

### Primary (HIGH confidence)

- Direct file inspection: `backend/prisma/schema.prisma` — Transaction model, enums, indexes confirmed
- Direct file inspection: `backend/src/generated/prismabox/Transaction.ts` — `TransactionPlainInputCreate`, `TransactionPlainInputUpdate` schemas confirmed; `categoryId` gap confirmed
- Direct file inspection: `backend/src/modules/category/` — reference implementation pattern confirmed
- Direct file inspection: `backend/src/index.ts` — controller mount pattern confirmed
- Direct file inspection: `.claude/skills/backend-module.md` — skill template confirmed

### Secondary (MEDIUM confidence)

- Prisma docs (training data): `prisma.$transaction([findMany, count])` for atomic pagination — standard pattern, HIGH confidence from widespread usage

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from package.json and generated files
- Architecture: HIGH — reference implementation (category module) fully inspected
- Pitfalls: HIGH — derived from direct schema and prismabox inspection, not speculation
- Test architecture: LOW — no test infrastructure exists; Bun test runner is built-in but no project patterns established

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable stack — Prisma schema won't change without a schema migration)
