# Skill: Error Handling

## When to Use

When throwing errors from service methods or defining custom error types.

## Built-in Elysia Errors (use these first)

```typescript
import { NotFoundError } from "elysia"

// 404 — resource not found
throw new NotFoundError("Transaction not found")
```

Elysia maps these automatically to the correct HTTP status code.

## Custom Domain Errors

For non-404 errors, add to `src/global/error.ts`:

```typescript
// src/global/error.ts
export class Conflict extends Error {
  status = 409
  constructor(public message: string) {
    super(message)
  }
}

export class Forbidden extends Error {
  status = 403
  constructor(public message: string) {
    super(message)
  }
}

export class BadRequest extends Error {
  status = 400
  constructor(public message: string) {
    super(message)
  }
}
```

Elysia reads the `status` property on Error instances and uses it as the HTTP status code automatically.

## Usage in Services

```typescript
import { NotFoundError } from "elysia"
import { Conflict, Forbidden } from "../../global/error"

static async create(userId: string, input: CreateInput) {
  const exists = await prisma.category.findFirst({ where: { name: input.name, userId } })
  if (exists) throw new Conflict("Category name already exists")

  const result = await prisma.category.create({ data: { ...input, userId } })
  return status(201, result)
}

static async update(userId: string, id: string, input: UpdateInput) {
  const item = await prisma.category.findUnique({ where: { id, userId } })
  if (!item) throw new NotFoundError("Category not found")

  return prisma.category.update({ where: { id, userId }, data: input })
}
```

## Rules

- Throw errors from service methods — never return error objects
- Use `NotFoundError` (from elysia) for 404s
- Use custom error classes from `src/global/error.ts` for 409, 403, 400
- Custom errors need a `status` number property — Elysia reads this automatically
- Never add try/catch in controllers — let errors propagate
- Validate existence before update/delete — always throw `NotFoundError` if not found
