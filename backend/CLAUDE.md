# Backend — Bun + Elysia + Prisma 7

## File map

```
src/index.ts                         — Elysia entry, CORS config, mounts all modules at /api
src/lib/auth.ts                      — Better Auth server config (email/password, Google OAuth, rate limiting)
src/lib/prisma.ts                    — Prisma client with TiDB Cloud serverless adapter
src/modules/
  auth/
    index.ts                         — Raw handler proxying all auth requests to Better Auth
  category/
    index.ts                         — Elysia plugin (controller): routes, auth guard, Zod validation
    service.ts                       — Business logic and Prisma queries (always userId-scoped)
    model.ts                         — Zod v4 schemas and inferred TS types for request bodies
src/utils/
  session/
    index.ts                         — getSession(request) — wraps auth.api.getSession()
src/generated/prisma/                — Auto-generated Prisma client (DO NOT EDIT)
src/generated/prismabox/             — Auto-generated Elysia validation schemas from Prisma models (DO NOT EDIT)
prisma/schema.prisma                 — 13 models, relationMode = "prisma" (no FK constraints)
```

## Database models

### Auth tables (managed by Better Auth)
- **User** — id (UUID v7), name, email, emailVerified, image, currency, createdAt, updatedAt
- **Session** — id, expiresAt, token, ipAddress, userAgent → User
- **Account** — id, providerId, accountId, password hash → User
- **Verification** — id, identifier, value, expiresAt

### App core
- **Category** — id (UUID v7), name, icon, type (expense/income) → User
- **Transaction** — id (UUID v7), type, source, amount, description, date, categoryId → User, Category, AiExtraction
- **RecurringTransaction** — id (UUID v7), frequency (weekly/biweekly/monthly/yearly), nextDate, amount → User, Category

### Email/AI pipeline
- **EmailInbox** — id (UUID v7), email, imapHost/Port/User/Password → User
- **EmailLog** — id (BigInt), status (received/processing/parsed/skipped/error), subject, from → User, EmailInbox
- **AiExtraction** — id (BigInt), status (pending/confirmed/rejected/edited), extractedData → EmailLog, Transaction
- **Attachment** — id (BigInt), fileName, fileUrl, fileType → Transaction

### System
- **DefaultCategory** — id (BigInt), name, icon, type

## Adding a new module

Each app module lives in `src/modules/<name>/` with three files:

| File         | Role                                                                 |
|--------------|----------------------------------------------------------------------|
| `model.ts`   | Zod v4 schemas (`createXSchema`, `updateXSchema`) + inferred types  |
| `service.ts` | Prisma queries — all methods receive `userId` and scope queries to it |
| `index.ts`   | Elysia plugin (controller) — routes, auth guard, Zod validation      |

**Steps to add a module:**
1. Create `src/modules/<name>/{model,service,index}.ts`
2. Export an Elysia plugin from `index.ts` using the pattern below
3. Mount in `src/index.ts` with `.use(<name>Module)`

**Controller pattern (`index.ts`):**
```typescript
export const xModule = new Elysia({ prefix: "/xs" })
  .derive(async ({ request }) => ({ session: await getSession(request) }))
  .onBeforeHandle(({ session, status }) => {
    if (!session) return status(401, { error: "Unauthorized" })
  })
  .get("/", async ({ session, status }) => { ... })
  .post("/", async ({ session, body, status }) => { ... })
  // etc.
```

**Service pattern (`service.ts`):**
```typescript
export const xService = {
  async list(userId: string) { ... },
  async getById(id: string, userId: string) {
    const item = await prisma.x.findFirst({ where: { id, userId } })
    if (!item) throw { status: 404, message: "Not found" }
    return item
  },
  async update(id: string, userId: string, data: UpdateXDto) {
    const existing = await prisma.x.findFirst({ where: { id } })
    if (!existing) throw { status: 404, message: "Not found" }
    if (existing.userId !== userId) throw { status: 403, message: "Forbidden" }
    return prisma.x.update({ where: { id }, data })
  },
}
```

**Model pattern (`model.ts`):**
```typescript
import { z } from "zod/v4"
export const createXSchema = z.object({ ... })
export const updateXSchema = createXSchema.partial()
export type CreateXDto = z.infer<typeof createXSchema>
export type UpdateXDto = z.infer<typeof updateXSchema>
```

## Key patterns
- **Auth module** uses a raw handler pattern (not a plugin) — exception, not the rule
- **App modules** use the Elysia plugin pattern with `.derive()` + `.onBeforeHandle()` for auth
- **Session utility** — always use `getSession(request)` from `src/utils/session/index.ts`
- **Ownership checks** — service throws `{ status, message }` plain objects; controller catches and forwards via `status(code, body)`
- **Zod v4** — `import { z } from "zod/v4"` for all validation schemas
- **Prisma client** — import from `src/lib/prisma.ts` (uses `@tidbcloud/prisma-adapter`, not standard MySQL)
- **No FK enforcement** — `relationMode = "prisma"`, so always filter by `userId` explicitly
- Run `bunx prisma generate` after any schema change to regenerate client + prismabox types

## Error response convention

| Scenario           | Status | Body                        |
|--------------------|--------|-----------------------------|
| No session         | 401    | `{ error: "Unauthorized" }` |
| Zod parse failure  | 422    | `{ error: issues[] }`       |
| Record not found   | 404    | `{ error: "Not found" }`    |
| Wrong user         | 403    | `{ error: "Forbidden" }`    |
