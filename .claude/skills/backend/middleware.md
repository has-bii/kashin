# Skill: Middleware

## When to Use

When adding cross-cutting concerns to routes: auth checks, rate limiting, request transformation, or shared context.

## How Middleware Works in Elysia

Elysia uses **plugins** with lifecycle hooks — not express-style middleware functions.

| Mechanism | Use For |
|-----------|---------|
| `.macro()` | Per-route opt-in behavior (like `{ auth: true }`) |
| `.derive()` | Inject data into context for downstream handlers |
| `.onBeforeHandle()` | Guards — reject requests early |
| `.use(plugin)` | Compose plugins onto a controller |

## Existing Middleware

- **Auth**: `src/macros/auth.macro.ts` — use `.use(authMacro)` + `{ auth: true }` (see `auth.md`)
- **Rate limit**: registered globally in `src/index.ts` via `elysia-rate-limit`
- **CORS**: registered globally in `src/index.ts` via `@elysiajs/cors`

## Creating a New Plugin

```typescript
// src/plugins/log.plugin.ts
import { Elysia } from "elysia"

export const logPlugin = new Elysia({ name: "log" })
  .derive(({ request }) => ({
    requestId: crypto.randomUUID(),
  }))
  .onBeforeHandle(({ request, requestId }) => {
    console.log(`[${requestId}] ${request.method} ${request.url}`)
  })

// Usage — scope to a controller:
export const myController = new Elysia({ prefix: "/my" })
  .use(logPlugin)
  .get("/", () => "ok")
```

## Creating a Macro (opt-in per route)

Macros are the right pattern when behavior is opt-in per route (not applied to all routes):

```typescript
// src/macros/my.macro.ts
import Elysia from "elysia"

export const myMacro = new Elysia({ name: "my-macro" }).macro({
  requireRole: {
    async resolve({ status, request: { headers } }, role: string) {
      // check role from session
      const hasRole = /* ... */ true
      if (!hasRole) return status(403, { error: "Forbidden" })
      return { role }
    },
  },
})

// Usage:
controller.use(myMacro).get("/admin", handler, { requireRole: "admin" })
```

## Rules

- Global middleware (CORS, rate limit) goes in `src/index.ts` only
- Per-controller middleware: `.use(plugin)` in the controller file
- Prefer macros over `onBeforeHandle` for opt-in per-route behavior
- Give plugins a `name` to prevent duplicate registration
- Never write express-style `(req, res, next)` middleware
