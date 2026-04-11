# Skill: Endpoint

## When to Use

When creating a new API module or adding routes to an existing module.

## File Locations

```
src/modules/<name>/
  index.ts    ← Elysia controller, exports {name}Controller
  query.ts    ← TypeBox query param schemas
  service.ts  ← Abstract class with static methods + TypeBox body schemas
```

Register in `src/index.ts` with `.use({name}Controller)`.

## Pattern

1. Create `src/modules/<name>/` folder
2. Define query schemas in `query.ts` using TypeBox `t`
3. Define body schemas + service logic in `service.ts`
   - Use prismabox-generated schemas (`{Model}PlainInputCreate/Update`) when possible
   - Extend with `t.Composite([GeneratedSchema, t.Object({...})])` for extra fields
4. Create `index.ts` controller as Elysia plugin
5. Register in `src/index.ts`

## Template

```typescript
// query.ts
import { t } from "elysia"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  // add filters here
})

// service.ts
import { NotFoundError, status, t } from "elysia"
import { {Model}PlainInputCreate, {Model}PlainInputUpdate } from "../../generated/prismabox/{Model}"
import { prisma } from "../../lib/prisma"
import { getAllQuery } from "./query"

type CreateInput = (typeof {Model}PlainInputCreate)["static"]
type UpdateInput = (typeof {Model}PlainInputUpdate)["static"]
type GetAllQuery = (typeof getAllQuery)["static"]

export abstract class {Name}Service {
  static async getAll(userId: string, query: GetAllQuery) {
    const { page = 1, limit = 20 } = query
    const skip = (page - 1) * limit
    const where = { userId }

    const [data, total] = await prisma.$transaction([
      prisma.{model}.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.{model}.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async getById(userId: string, id: string) {
    const item = await prisma.{model}.findUnique({ where: { id, userId } })
    if (!item) throw new NotFoundError("{Name} not found")
    return item
  }

  static async create(userId: string, input: CreateInput) {
    const result = await prisma.{model}.create({ data: { ...input, userId } })
    return status(201, result)
  }

  static async update(userId: string, id: string, input: UpdateInput) {
    const exists = await prisma.{model}.findUnique({ where: { id, userId } })
    if (!exists) throw new NotFoundError("{Name} not found")
    return prisma.{model}.update({ where: { id, userId }, data: input })
  }

  static async delete(userId: string, id: string) {
    const exists = await prisma.{model}.findUnique({ where: { id, userId } })
    if (!exists) throw new NotFoundError("{Name} not found")
    return prisma.{model}.delete({ where: { id, userId } })
  }
}

// index.ts
import { authMacro } from "../../macros/auth.macro"
import { getAllQuery } from "./query"
import { {Name}Service } from "./service"
import { {Model}PlainInputCreate, {Model}PlainInputUpdate } from "../../generated/prismabox/{Model}"
import Elysia from "elysia"

export const {name}Controller = new Elysia({ prefix: "/{name}" })
  .use(authMacro)
  .get("/", async ({ user, query }) => {Name}Service.getAll(user.id, query), {
    auth: true,
    query: getAllQuery,
  })
  .get("/:id", async ({ user, params }) => {Name}Service.getById(user.id, params.id), {
    auth: true,
  })
  .post("/", async ({ user, body }) => {Name}Service.create(user.id, body), {
    auth: true,
    body: {Model}PlainInputCreate,
  })
  .put("/:id", async ({ user, body, params }) => {Name}Service.update(user.id, params.id, body), {
    auth: true,
    body: {Model}PlainInputUpdate,
  })
  .delete("/:id", async ({ user, params }) => {Name}Service.delete(user.id, params.id), {
    auth: true,
  })
```

## Rules

- Service is `abstract class` with `static` methods — never instantiate
- Controller handlers are thin — only call service, never contain logic
- Always use `authMacro` + `{ auth: true }` on every route
- Prefer prismabox-generated schemas over hand-written TypeBox
- Use `status(201, result)` for creates, direct return for reads/updates/deletes
