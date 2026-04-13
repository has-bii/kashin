---
name: validation
description: Defining request body schemas, query param schemas, or extending Prismabox-generated schemas. Use when the user asks about validating input, TypeBox schemas, or Prismabox models.
---

# Skill: Validation

## When to Use

When defining request body schemas, query param schemas, or extending Prismabox-generated schemas.

## Libraries

- **TypeBox `t`** (from `elysia`) — for route-level schemas (body, query, params)
- **Prismabox** (from `../../generated/prismabox/{Model}`) — auto-generated TypeBox schemas from Prisma models
- **Zod** — only for internal data transformations, not route validation

## File Locations

- Query schemas: `modules/{domain}/query.ts`
- Body schemas: `modules/{domain}/service.ts` (exported constants)

## Patterns

### Query Params (in `query.ts`)

```typescript
import { t } from "elysia"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
  search: t.Optional(t.String()),
  dateFrom: t.Optional(t.String()),  // ISO date string
  dateTo: t.Optional(t.String()),
})
```

### Body Schemas (in `service.ts`)

```typescript
// Option A: Use Prismabox directly (simplest)
import { {Model}PlainInputCreate, {Model}PlainInputUpdate } from "../../generated/prismabox/{Model}"
export const {model}CreateBody = {Model}PlainInputCreate
export const {model}UpdateBody = {Model}PlainInputUpdate

// Option B: Extend with t.Composite (add/override fields)
import { __nullable__ } from "../../generated/prismabox/__nullable__"
export const {model}CreateBody = t.Composite([
  {Model}PlainInputCreate,
  t.Object({ relatedId: t.Optional(__nullable__(t.String())) }),
])

// Option C: Custom TypeBox schema (when no Prismabox model exists)
import { t } from "elysia"
export const customBody = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  amount: t.Number({ minimum: 0 }),
  type: t.Union([t.Literal("a"), t.Literal("b")]),
  note: t.Optional(t.String()),
})
```

### Infer Types from Schemas

```typescript
type CreateInput = (typeof {model}CreateBody)["static"]
type GetAllQuery = (typeof getAllQuery)["static"]
```

## Rules

- Use Prismabox `PlainInputCreate`/`PlainInputUpdate` first — only write custom schemas when you need to add/override fields
- Use `__nullable__` wrapper for optional nullable fields from Prisma schema
- Query params are validated on the route's `query:` option — Elysia coerces types automatically
- Body schemas go on the route's `body:` option
- Infer types with `["static"]` — never write duplicate type definitions
