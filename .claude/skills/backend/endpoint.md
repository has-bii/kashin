# Skill: Endpoint

## When to Use

When creating a new API endpoint or adding routes to an existing module.

## File Locations

- Controller: `backend/src/modules/{domain}/index.ts`
- Query schemas: `backend/src/modules/{domain}/query.ts`
- Business logic: `backend/src/modules/{domain}/service.ts`
- Register in: `backend/src/index.ts`

## Module Structure

Each domain has exactly 3 files — no more, no less:

```
modules/{domain}/
  index.ts    — Elysia controller (routes, auth, validation options)
  query.ts    — TypeBox query param schemas (exported, used in index.ts + service.ts)
  service.ts  — Abstract class with static methods + body schemas
```

## Pattern

1. Create `modules/{domain}/query.ts` with TypeBox `t.Object` for query params
2. Create `modules/{domain}/service.ts` with body schemas + `abstract class {Domain}Service`
3. Create `modules/{domain}/index.ts` as Elysia plugin with `prefix: "/{domain}"`
4. `.use(authMacro)` on the controller, `auth: true` on each protected route
5. Register the controller in `backend/src/index.ts` with `.use({domain}Controller)`

## Template

```typescript
// modules/{domain}/query.ts
import { t } from "elysia"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  // add domain-specific filters here
})

// modules/{domain}/service.ts
import { NotFoundError, status, t } from "elysia"
import { {Domain}PlainInputCreate, {Domain}PlainInputUpdate } from "../../generated/prismabox/{Domain}"
import { prisma } from "../../lib/prisma"
import { getAllQuery } from "./query"

export const {domain}CreateBody = {Domain}PlainInputCreate
export const {domain}UpdateBody = {Domain}PlainInputUpdate

type {Domain}CreateInput = (typeof {domain}CreateBody)["static"]
type {Domain}UpdateInput = (typeof {domain}UpdateBody)["static"]
type GetAllQuery = (typeof getAllQuery)["static"]

export abstract class {Domain}Service {
  static async getAll(userId: string, query: GetAllQuery) {
    const { page = 1, limit = 20 } = query
    const [data, total] = await prisma.$transaction([
      prisma.{domain}.findMany({ where: { userId }, skip: (page - 1) * limit, take: limit }),
      prisma.{domain}.count({ where: { userId } }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async getById(userId: string, id: string) {
    const item = await prisma.{domain}.findUnique({ where: { id, userId } })
    if (!item) throw new NotFoundError("{Domain} doesn't exist")
    return item
  }

  static async create(userId: string, input: {Domain}CreateInput) {
    const result = await prisma.{domain}.create({ data: { ...input, userId } })
    return status(201, result)
  }

  static async update(userId: string, id: string, input: {Domain}UpdateInput) {
    const isExist = await prisma.{domain}.findUnique({ where: { id, userId } })
    if (!isExist) throw new NotFoundError("{Domain} doesn't exist")
    return prisma.{domain}.update({ where: { id, userId }, data: input })
  }

  static async delete(userId: string, id: string) {
    const isExist = await prisma.{domain}.findUnique({ where: { id, userId } })
    if (!isExist) throw new NotFoundError("{Domain} doesn't exist")
    return prisma.{domain}.delete({ where: { id, userId } })
  }
}

// modules/{domain}/index.ts
import { authMacro } from "../../macros/auth.macro"
import { getAllQuery } from "./query"
import { {Domain}Service, {domain}CreateBody, {domain}UpdateBody } from "./service"
import Elysia from "elysia"

export const {domain}Controller = new Elysia({ prefix: "/{domain}" })
  .use(authMacro)
  .get("/", async ({ user, query }) => {Domain}Service.getAll(user.id, query), {
    auth: true,
    query: getAllQuery,
  })
  .get("/:id", async ({ user, params }) => {Domain}Service.getById(user.id, params.id), {
    auth: true,
  })
  .post("/", async ({ user, body }) => {Domain}Service.create(user.id, body), {
    auth: true,
    body: {domain}CreateBody,
  })
  .put("/:id", async ({ user, body, params }) => {Domain}Service.update(user.id, params.id, body), {
    auth: true,
    body: {domain}UpdateBody,
  })
  .delete("/:id", async ({ user, params }) => {Domain}Service.delete(user.id, params.id), {
    auth: true,
  })
```

## Rules

- Controller is a named export: `{domain}Controller`
- Service is `abstract class {Domain}Service` with only `static` methods — never instantiate
- Body schemas exported from `service.ts`, query schemas from `query.ts`
- `auth: true` on every route that needs authentication
- Register controller in `src/index.ts` with `.use({domain}Controller)`
- Named exports only — no default exports
