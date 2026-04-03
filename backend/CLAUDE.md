# Backend — Bun + Elysia + Prisma 7

## File map

```
src/index.ts                    — Elysia entry, CORS config, mounts routes at /api
src/lib/auth.ts                 — Better Auth server config (email/password, Google OAuth, rate limiting)
src/lib/prisma.ts               — Prisma client with TiDB Cloud serverless adapter
src/modules/auth/index.ts       — Auth route handler, proxies to Better Auth via .all("/auth/*")
src/generated/prisma/           — Auto-generated Prisma client (DO NOT EDIT)
src/generated/prismabox/        — Auto-generated Elysia validation schemas from Prisma models (DO NOT EDIT)
prisma/schema.prisma            — 13 models, relationMode = "prisma" (no FK constraints)
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

1. Create `src/modules/<name>/index.ts`
2. Export an Elysia handler or plugin
3. Mount in `src/index.ts` (use `.use()` for Elysia plugins or `.all()` / `.get()` / `.post()` for raw handlers)

## Key patterns
- Auth routes use raw handler pattern: `export const handler = (context: Context) => { ... }`
- Prisma client imported from `src/lib/prisma.ts` (uses `@tidbcloud/prisma-adapter`, not standard MySQL)
- Prismabox auto-generates Elysia-compatible validation schemas from Prisma models
- Run `bunx prisma generate` after any schema change to regenerate client + prismabox types
