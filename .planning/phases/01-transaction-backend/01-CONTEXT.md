# Phase 1 Context: Transaction Backend

**Phase:** 1 — Transaction Backend
**Goal:** CRUD API with server-side filtering, pagination, and v2-ready schema
**Discussion date:** 2026-04-04

---

## Canonical Refs

- `backend/prisma/schema.prisma` — Transaction model, TransactionType enum, TransactionSource enum
- `backend/src/modules/category/index.ts` — Controller pattern to follow
- `backend/src/modules/category/service.ts` — Service pattern to follow
- `backend/src/modules/category/query.ts` — Query param schema pattern to follow

---

## Decisions

### Amount serialization
**Decision:** Return `amount` as a **string** in all JSON responses.

Prisma's `Decimal` type serializes to string by default — keep it that way. No conversion to `number` in the service layer.

- All list and single-transaction responses: `"amount": "1234.50"`
- Frontend uses `Intl.NumberFormat` for display (accepts strings), parses only when arithmetic is needed
- This applies to every endpoint that returns transaction data

---

### Pagination
**Decision:** Offset/limit pagination with a standard envelope.

Query params: `page` (default 1) + `limit` (default 20, max TBD by planner).

Response envelope for the list endpoint:
```json
{
  "data": Transaction[],
  "total": number,
  "page": number,
  "limit": number,
  "totalPages": number
}
```

No cursor-based pagination — not needed for a personal finance app with hundreds to low-thousands of records.

---

### Category nesting in response
**Decision:** Include a nested category object on every transaction response.

Shape:
```json
{
  "category": {
    "id": "...",
    "name": "Food",
    "type": "expense",
    "icon": "🍔",
    "color": "#ff5733"
  }
}
```

When `categoryId` is null, `category` is `null`.

This applies to both single-transaction and list responses. Avoids requiring the frontend to cross-reference a separate categories cache when rendering the list.

Prisma query: `include: { category: { select: { id, name, type, icon, color } } }`

---

### categoryId optionality
**Decision:** `categoryId` is **optional** on create and update.

- Create endpoint: `categoryId` may be omitted → transaction saved with `category: null`
- Update endpoint: `categoryId` may be omitted → existing value unchanged (patch semantics)
- Frontend may visually flag uncategorized transactions, but the API does not enforce it

---

## Codebase Notes (for planner)

- Transaction schema is v2-ready: `source` (TransactionSource enum, default `manual`), `aiExtractionId`, `recurringTxnId` all nullable — STATE.md blocker #2 confirmed resolved, no schema changes needed
- `DECIMAL(15,2)` already in schema — covers STATE.md blocker #1; no custom Prisma middleware needed, just don't call `.toNumber()`
- No existing pagination pattern — planner needs to build query param schema from scratch (follow `query.ts` typebox pattern)
- Follow module pattern: `index.ts` (controller) + `service.ts` (static abstract class) + `query.ts` (Typebox query params)
- Prismabox body schemas auto-generated — planner should verify `TransactionPlainInputCreate` / `TransactionPlainInputUpdate` exist after `prisma generate`
- Auth guard: `.use(authMacro)` + `{ auth: true }` on every route
- All service methods: `userId` as first param, filter all queries by `userId`

---

## Deferred Ideas

None surfaced during discussion.
