# Skill: Auth

## When to Use

When protecting routes, accessing the current user, or working with sessions.

## How Auth Works

Better Auth handles all session management. The `authMacro` reads the session from request headers and injects `user` and `session` into the Elysia context.

```
Request headers → authMacro → auth.api.getSession() → { user, session } in context
```

## Protecting a Route

```typescript
import { authMacro } from "../../macros/auth.macro"
import Elysia from "elysia"

export const myController = new Elysia({ prefix: "/my-resource" })
  .use(authMacro)                     // 1. mount the macro
  .get("/", async ({ user }) => {     // 2. user is now typed + guaranteed
    return MyService.getAll(user.id)
  }, {
    auth: true,                       // 3. require auth on this route
  })
```

If `auth: true` is set and no valid session exists, Elysia returns `401 { error: "Unauthorized" }` automatically.

## Accessing User in Service

Pass `user.id` (and `user` if needed) from the controller to the service:

```typescript
// controller
.get("/", async ({ user }) => MyService.getAll(user.id), { auth: true })

// service
static async getAll(userId: string) {
  return prisma.resource.findMany({ where: { userId } })
}
```

## Auth Routes

The Better Auth handler is mounted in `src/modules/auth/index.ts` and registered as:
```typescript
app.all("/auth/*", betterAuthView)
```

All Better Auth routes (`/api/auth/sign-in`, `/api/auth/sign-up`, etc.) are handled there. Do not create custom auth endpoints — use Better Auth's API or plugins.

## Auth Configuration

Auth is configured in `src/lib/auth.ts`. Current setup:
- Email/password with email verification (OTP)
- Google OAuth
- `emailOTP` plugin (used for change-email flow)

## Rules

- Always `.use(authMacro)` before any route that needs auth
- Always add `{ auth: true }` to each protected route — it's per-route, not per-controller
- Never read session/cookies manually — authMacro handles it
- Never write custom JWT logic — Better Auth manages tokens
- User ID is always `user.id` (UUID) — always scope queries with `userId`
