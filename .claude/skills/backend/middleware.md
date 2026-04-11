# Skill: Middleware

## When to Use

When adding cross-cutting concerns: auth checks, shared context injection, rate limiting, lifecycle hooks.

## File Locations

- Macros/plugins: `backend/src/macros/{name}.macro.ts`
- Shared plugins: `backend/src/plugins/{name}.plugin.ts` (if needed)

## Pattern

Elysia middleware is done via **plugins** and **macros** — not raw middleware functions.

- Use `.macro()` for declarative per-route options (like `auth: true`)
- Use `.derive()` to inject values into the request context
- Use `.onBeforeHandle()` for guards/early returns
- Give plugins a `name` to prevent duplicate registration

## Auth Macro (existing — use this, don't create another)

```typescript
// src/macros/auth.macro.ts — already exists, import and use
import { authMacro } from "../../macros/auth.macro"

export const myController = new Elysia({ prefix: "/..." })
  .use(authMacro)          // register macro
  .get("/", handler, { auth: true })  // opt-in per route
```

## Creating a New Plugin

```typescript
// src/macros/{name}.macro.ts
import { auth } from "../lib/auth"
import Elysia from "elysia"

export const {name}Plugin = new Elysia({ name: "{name}-plugin" })
  .derive(({ headers }) => {
    // add values to context — available in all handlers below
    return { myValue: computedValue }
  })
  .onBeforeHandle(({ myValue, status }) => {
    if (!myValue) return status(403, { error: "Forbidden" })
  })
```

## Rules

- Always set `name` on plugin instances to prevent Elysia from re-registering them
- `.derive()` adds to context, `.onBeforeHandle()` guards/rejects
- The existing `authMacro` covers all auth — never write a custom token check in a route handler
- Lifecycle order: `onRequest` → `onBeforeHandle` → handler → `onAfterHandle` → `onResponse`
