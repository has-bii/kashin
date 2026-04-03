# Backend — Bun + Elysia + Prisma 7

## Directory structure

```
src/index.ts                         — Elysia entry, CORS, mounts all modules at /api
src/lib/auth.ts                      — Better Auth config (email/password, Google OAuth)
src/lib/prisma.ts                    — Prisma client with TiDB Cloud adapter
src/macros/auth.macro.ts             — Auth guard macro: { auth: true } injects user/session
src/global/error.ts                  — Custom error classes (Conflict 409)
src/modules/<name>/index.ts          — Controller (Elysia plugin with routes)
src/modules/<name>/service.ts        — Business logic (abstract class, static methods)
src/modules/<name>/query.ts          — Typebox query param schemas
src/generated/prisma/                — Auto-generated Prisma client (DO NOT EDIT)
src/generated/prismabox/             — Auto-generated Elysia validation schemas (DO NOT EDIT)
prisma/schema.prisma                 — All models, relationMode = "prisma"
```

## Key patterns

- **Body validation**: Use prismabox types from `src/generated/prismabox/<Model>.ts`
- **Query validation**: Use Elysia's `t` typebox in `query.ts`
- **Type extraction**: `(typeof XPlainInputCreate)["static"]` for TS types
- **Status codes**: `status(201, data)` from elysia for non-200
- **Errors**: `NotFoundError` (404) from elysia, `Conflict` (409) from `src/global/error.ts`
- **Auth**: All routes use `{ auth: true }` macro — first arg is always `userId`
- **Prisma**: Import from `src/lib/prisma.ts`, always filter by `userId`
- Run `bunx --bun prisma generate` after any schema change

## Adding a module

Use the **`backend-module`** skill. Reference implementation: `src/modules/category/`
