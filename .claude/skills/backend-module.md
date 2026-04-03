---
name: backend-module
description: Create a new backend Elysia module (controller + service + query). Use when adding a new API resource.
---

# Backend Module Development

Create a new module at `backend/src/modules/<name>/` with 3 files. Use `category` module as the reference implementation.

## Pre-flight

1. Check if the Prisma model exists in `prisma/schema.prisma`
   - If not, add it and run `bunx --bun prisma generate` to regenerate client + prismabox types
2. Confirm prismabox types exist at `src/generated/prismabox/<Model>.ts`

## Step 1: `query.ts` — Query parameter schemas

```ts
import { t } from "elysia";

export const getAllQuery = t.Object({
  // Add query params as needed (all Optional)
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
});
```

## Step 2: `service.ts` — Business logic

```ts
import { <Model>PlainInputCreate, <Model>PlainInputUpdate } from "../../generated/prismabox/<Model>"
import { Conflict } from "../../global/error"
import { prisma } from "../../lib/prisma"
import { NotFoundError, status } from "elysia"

export abstract class <Name>Service {
  static async getAll(userId: string) {
    return prisma.<model>.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
  }

  static async create(userId: string, input: (typeof <Model>PlainInputCreate)["static"]) {
    // Add uniqueness checks if needed
    return status(201, await prisma.<model>.create({ data: { ...input, userId } }))
  }

  static async update(userId: string, id: string, input: (typeof <Model>PlainInputUpdate)["static"]) {
    return prisma.<model>.update({ where: { id, userId }, data: input })
  }

  static async delete(userId: string, id: string) {
    const exists = await prisma.<model>.findUnique({ where: { id, userId } })
    if (!exists) throw new NotFoundError("<Name> doesn't exist")
    return prisma.<model>.delete({ where: { id, userId } })
  }
}
```

**Key rules:**

- Always scope queries by `userId` (no FK enforcement)
- Use `(typeof <Model>PlainInputCreate)["static"]` for input types
- `status(201, data)` for create, `NotFoundError` for 404, `Conflict` for 409

## Step 3: `index.ts` — Controller (Elysia plugin)

```ts
import { <Model>PlainInputCreate, <Model>PlainInputUpdate } from "../../generated/prismabox/<Model>"
import { authMacro } from "../../macros/auth.macro"
import { getAllQuery } from "./query"
import { <Name>Service } from "./service"
import Elysia from "elysia"

export const <name>Controller = new Elysia({ prefix: "/<name>" })
  .use(authMacro)
  .get("/", async ({ user, query }) => <Name>Service.getAll(user.id), {
    auth: true,
    query: getAllQuery,
  })
  .post("/", async ({ user, body }) => <Name>Service.create(user.id, body), {
    auth: true,
    body: <Model>PlainInputCreate,
  })
  .put("/:id", async ({ user, body, params }) => <Name>Service.update(user.id, params.id, body), {
    auth: true,
    body: <Model>PlainInputUpdate,
  })
  .delete("/:id", async ({ user, params }) => <Name>Service.delete(user.id, params.id), {
    auth: true,
  })
```

## Step 4: Mount in `src/index.ts`

Add import and `.use(<name>Controller)` to the Elysia app chain.

## Step 5: Update progress

Append entry to `/CHANGELOG.md` with what was added.

## Checklist

- [ ] Prisma model exists and `bunx --bun prisma generate` ran
- [ ] `query.ts` created with query param schemas
- [ ] `service.ts` created with all CRUD methods
- [ ] `index.ts` created as Elysia plugin with auth macro
- [ ] Mounted in `src/index.ts`
- [ ] Tested with dev server (`bun run dev`)
- [ ] CHANGELOG.md updated
