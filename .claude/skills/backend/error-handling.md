---
name: error-handling
description: Throwing errors in service methods or creating new custom error types. Use when the user asks about 404, 409, or any error thrown from a service.
---

# Skill: Error Handling

## When to Use

When throwing errors in service methods or creating new error types.

## File Locations

- Built-in Elysia errors: import from `elysia`
- Custom errors: `backend/src/global/error.ts`

## Available Error Types

```typescript
// From elysia — use these first
import { NotFoundError, status } from "elysia"
throw new NotFoundError("Transaction doesn't exist")  // → 404

// From global/error.ts — for conflict/duplicate scenarios
import { Conflict } from "../../global/error"
throw new Conflict("Email already registered")  // → 409

// Inline status for auth rejections (in macros/guards only)
return status(401, { error: "Unauthorized" })
return status(403, { error: "Forbidden" })
```

## Pattern

```typescript
// In service.ts — throw, don't catch
static async getById(userId: string, id: string) {
  const item = await prisma.{model}.findUnique({ where: { id, userId } })
  if (!item) throw new NotFoundError("{Model} doesn't exist")
  return item
}

static async create(userId: string, input: CreateInput) {
  const existing = await prisma.{model}.findUnique({ where: { uniqueField: input.uniqueField } })
  if (existing) throw new Conflict("{Model} already exists")
  // ...
}
```

## Adding New Error Types

Only add to `global/error.ts` when the existing types don't cover the HTTP status you need:

```typescript
// backend/src/global/error.ts
export class BadRequest extends Error {
  status = 400
  constructor(public message: string) {
    super(message)
  }
}
```

## Rules

- Throw errors in service methods — never try/catch in `index.ts` route handlers
- Elysia catches errors with a matching `status` property automatically
- `NotFoundError` (404) and `Conflict` (409) cover ~90% of cases — use them first
- Never return error objects — always `throw`
- Validation errors (wrong body/query shape) are handled automatically by Elysia — don't handle manually
