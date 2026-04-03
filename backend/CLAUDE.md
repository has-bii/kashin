# Backend — Bun + Elysia + Prisma 7

## File map

```
src/index.ts                         — Elysia entry, CORS config, mounts all modules at /api
src/lib/auth.ts                      — Better Auth server config (email/password, Google OAuth, rate limiting)
src/lib/prisma.ts                    — Prisma client with TiDB Cloud serverless adapter
src/macros/
  auth.macro.ts                      — Elysia macro: auth guard via { auth: true } route option
src/global/
  error.ts                           — Custom error classes (Conflict 409)
src/modules/
  auth/
    index.ts                         — Raw handler proxying all auth requests to Better Auth
  category/
    index.ts                         — Elysia plugin (controller): routes, auth guard, prismabox validation
    service.ts                       — Business logic and Prisma queries (always userId-scoped)
    query.ts                         — Elysia typebox schemas for query parameters
src/generated/prisma/                — Auto-generated Prisma client (DO NOT EDIT)
src/generated/prismabox/             — Auto-generated Elysia validation schemas from Prisma models (DO NOT EDIT)
prisma/schema.prisma                 — 13 models, relationMode = "prisma" (no FK constraints)
```

## Database models

### Auth tables (managed by Better Auth)
- **User** — id (UUID v7), name, email, emailVerified, image, currency, timezone, createdAt, updatedAt
- **Session** — id, expiresAt, token, ipAddress, userAgent → User
- **Account** — id, providerId, accountId, password hash → User
- **Verification** — id, identifier, value, expiresAt

### App core
- **Category** — id (UUID v7), name, icon, type (expense/income) → User
- **Transaction** — id (UUID v7), type, source, amount, description, date, categoryId → User, Category, AiExtraction
- **RecurringTransaction** — id (UUID v7), frequency (weekly/biweekly/monthly/yearly), nextDate, amount → User, Category

### Email/AI pipeline
- **EmailInbox** — id (UUID v7), email, imapHost/Port/User/Password → User
- **EmailLog** — id (BigInt), status (received/processing/parsed/failed), subject, from → User, EmailInbox
- **AiExtraction** — id (BigInt), status (pending/confirmed/rejected/edited), extractedData → EmailLog, Transaction
- **Attachment** — id (BigInt), fileName, fileUrl, fileType → Transaction

### System
- **DefaultCategory** — id (BigInt), name, icon, type

## Adding a new module

Each app module lives in `src/modules/<name>/` with three files:

| File         | Role                                                                         |
|--------------|------------------------------------------------------------------------------|
| `query.ts`   | Elysia typebox schemas (`t.Object(...)`) for query string validation         |
| `service.ts` | Abstract class with static methods — all methods receive `userId` first      |
| `index.ts`   | Elysia plugin (controller) — routes, auth macro, prismabox body validation   |

**Steps to add a module:**
1. Create `src/modules/<name>/{query,service,index}.ts`
2. Export an Elysia plugin from `index.ts` using the pattern below
3. Mount in `src/index.ts` with `.use(<name>Controller)`

**Controller pattern (`index.ts`):**
```typescript
import { XPlainInputCreate, XPlainInputUpdate } from "../../generated/prismabox/X"
import { authMacro } from "../../macros/auth.macro"
import { getAllQuery } from "./query"
import { XService } from "./service"
import Elysia from "elysia"

export const xController = new Elysia({ prefix: "/x" })
  .use(authMacro)
  .get("/", async ({ user, query }) => XService.getAll(user.id, query.type), {
    auth: true,
    query: getAllQuery,
  })
  .post("/", async ({ user, body }) => XService.create(user.id, body), {
    auth: true,
    body: XPlainInputCreate,
  })
  .put("/:id", async ({ user, body, params }) => XService.update(user.id, params.id, body), {
    auth: true,
    body: XPlainInputUpdate,
  })
  .delete("/:id", async ({ user, params }) => XService.delete(user.id, params.id), {
    auth: true,
  })
```

**Service pattern (`service.ts`):**
```typescript
import { XPlainInputCreate } from "../../generated/prismabox/X"
import { Conflict } from "../../global/error"
import { prisma } from "../../lib/prisma"
import { NotFoundError, status } from "elysia"

export abstract class XService {
  static async getAll(userId: string) {
    return prisma.x.findMany({ where: { userId } })
  }

  static async create(userId: string, input: (typeof XPlainInputCreate)["static"]) {
    // Check uniqueness constraints
    const exists = await prisma.x.findUnique({ where: { name_userId: { name: input.name, userId } } })
    if (exists) throw new Conflict("X with the same name already exists")

    return status(201, await prisma.x.create({ data: { ...input, userId } }))
  }

  static async delete(userId: string, id: string) {
    const exists = await prisma.x.findUnique({ where: { id, userId } })
    if (!exists) throw new NotFoundError("X doesn't exist")

    return prisma.x.delete({ where: { id, userId } })
  }
}
```

**Query pattern (`query.ts`):**
```typescript
import { t } from "elysia"

export const getAllQuery = t.Object({
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
})
```

## Key patterns
- **Auth module** uses a raw handler pattern (not a plugin) — exception, not the rule
- **Auth macro** — `src/macros/auth.macro.ts` provides `{ auth: true }` route option; injects `user` and `session` into context
- **Body validation** — use prismabox auto-generated types from `src/generated/prismabox/` (e.g., `XPlainInputCreate`)
- **Query validation** — use Elysia's `t` typebox in `query.ts` files
- **Type extraction** — `(typeof XPlainInputCreate)["static"]` to get the TS type from prismabox validators
- **Non-200 status codes** — `import { status } from "elysia"` and return `status(201, data)`
- **Error classes** — `NotFoundError` from elysia (404), `Conflict` from `src/global/error.ts` (409)
- **Prisma client** — import from `src/lib/prisma.ts` (uses `@tidbcloud/prisma-adapter`, not standard MySQL)
- **No FK enforcement** — `relationMode = "prisma"`, so always filter by `userId` explicitly
- Run `bunx prisma generate` after any schema change to regenerate client + prismabox types

## Error response convention

| Scenario           | Status | Thrown with                                      |
|--------------------|--------|--------------------------------------------------|
| No session         | 401    | Auth macro returns `status(401, { error })` auto |
| Validation failure | 422    | Elysia handles automatically from schema         |
| Record not found   | 404    | `throw new NotFoundError("message")`             |
| Duplicate/conflict | 409    | `throw new Conflict("message")`                  |
