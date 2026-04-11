# Skill: Validation

## When to Use

When defining input schemas for request body, query params, or path params.

## How Validation Works

This project uses **two schema systems**:

| Where | Schema Type | Source |
|-------|------------|--------|
| Body input (CRUD) | TypeBox (via prismabox) | Auto-generated in `src/generated/prismabox/` |
| Query params | TypeBox `t` | Hand-written in `query.ts` |
| Extra body fields | TypeBox `t.Composite` | Extend generated schema |
| Service-internal | Zod | For complex validation logic only |

## Prismabox-Generated Schemas

After defining/updating a Prisma model, run `bun run generate` (or `bunx prisma generate`).
This produces in `src/generated/prismabox/{Model}.ts`:
- `{Model}PlainInputCreate` — all required fields for creation
- `{Model}PlainInputUpdate` — all fields optional for updates

Import and use directly — **do not write these by hand**.

## Extending Generated Schemas

When you need extra fields not in the Prisma model (e.g. a relation ID):

```typescript
import { t } from "elysia"
import { __nullable__ } from "../../generated/prismabox/__nullable__"
import { TransactionPlainInputCreate } from "../../generated/prismabox/Transaction"

export const transactionCreateBody = t.Composite([
  TransactionPlainInputCreate,
  t.Object({ categoryId: t.Optional(__nullable__(t.String())) }),
])

// Infer the static type
type CreateInput = (typeof transactionCreateBody)["static"]
```

## Query Param Schema

Define in `query.ts` alongside the module:

```typescript
import { t } from "elysia"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  search: t.Optional(t.String()),
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
  dateFrom: t.Optional(t.String()),
})
```

## Rules

- Never hand-write TypeBox schemas for Prisma model fields — use prismabox
- Use `__nullable__` helper (from generated folder) for nullable optional fields
- Infer TypeScript types from TypeBox with `(typeof schema)["static"]`
- Zod is available for complex service-layer validation, but TypeBox at the route boundary
