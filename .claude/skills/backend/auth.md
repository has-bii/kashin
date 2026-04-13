---
name: auth
description: Protecting API routes with authentication, accessing the current user or session in handlers. Use when the user asks to add auth guards, access user.id, or work with Better Auth sessions.
---

# Skill: Auth

## When to Use

When protecting routes, accessing the current user, or working with sessions.

## How Auth Works

Better Auth 1.5 provides session-based auth. The `authMacro` plugin reads the session from request headers and injects `user` and `session` into the handler context. Routes opt in with `auth: true`.

## File Locations

- Auth macro: `backend/src/macros/auth.macro.ts` — already exists, don't modify
- Auth server config: `backend/src/lib/auth.ts`

## Protecting a Route

```typescript
import { authMacro } from "../../macros/auth.macro"
import Elysia from "elysia"

export const myController = new Elysia({ prefix: "/my-resource" })
  .use(authMacro)          // 1. register the macro on the controller
  .get("/", async ({ user }) => {
    // user is typed as the Better Auth user object
    return doSomething(user.id)
  }, {
    auth: true,            // 2. opt-in per route
  })
  .get("/public", async () => {
    // no auth: true — this route is public
    return "public data"
  })
```

## Accessing User in Handler

```typescript
// user fields available:
user.id        // string — use this to scope all DB queries
user.email     // string
user.name      // string
user.image     // string | null
```

## Accessing Session in Handler

```typescript
.get("/session-info", async ({ session }) => {
  return { expiresAt: session.expiresAt }
}, { auth: true })
```

## Rules

- Always `.use(authMacro)` before adding `auth: true` routes on a controller
- Always scope Prisma queries to `userId` (from `user.id`) — never query global data
- `auth: true` routes get a 401 automatically if the session is missing/invalid
- Do not call `auth.api.getSession()` directly in route handlers — the macro handles it
- Auth routes (`/api/auth/*`) are handled by Better Auth via `betterAuthView` in `src/index.ts`
