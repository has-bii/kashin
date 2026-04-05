<!-- generated-by: gsd-doc-writer -->
# Configuration

This document describes all environment variables and configuration settings for Kashin. The project has two runtimes — a Bun/Elysia backend and a Next.js frontend — each with its own `.env.local` file.

---

## Environment Variables

### Backend (`backend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | **Required** | — | PostgreSQL connection string. Startup throws if missing. |
| `BETTER_AUTH_URL` | **Required** | — | Base URL of the backend server used by Better Auth (e.g., `http://localhost:3030`). |
| `GOOGLE_CLIENT_ID` | **Required** | — | Google OAuth client ID from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | **Required** | — | Google OAuth client secret from Google Cloud Console. |
| `FRONTEND_URL` | **Required** | — | URL of the frontend app. Used for CORS `origin` and Better Auth `trustedOrigins`. |
| `COOKIE_PREFIX` | Optional | Better Auth default | Prefix applied to all auth cookies. Must match the frontend value if set. |
| `PORT` | Optional | `3030` | Port the Elysia HTTP server listens on. |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Required** | — | Full URL to the backend API including `/api` path (e.g., `http://localhost:3030/api`). Used by the Axios client and auth client. |
| `NEXT_PUBLIC_APP_URL` | **Required** | — | Public URL of the frontend app. Used as the OAuth callback base URL after sign-in/sign-up. |
| `COOKIE_PREFIX` | Optional | Better Auth default | Must match the backend value if set. Used by the middleware to read the session cookie. |

---

## Required vs Optional Settings

The following settings cause an immediate startup failure if absent:

- **`DATABASE_URL`** — `backend/src/lib/prisma.ts` throws `Error: Database_URL is not set` on startup.
- **`GOOGLE_CLIENT_ID`** / **`GOOGLE_CLIENT_SECRET`** — Non-null assertions (`!`) in `backend/src/lib/auth.ts` will throw at runtime if the Google OAuth social provider is invoked without these values.
- **`FRONTEND_URL`** — Required by Better Auth `trustedOrigins` (`!` assertion) and the CORS `origin` configuration in `backend/src/index.ts`.
- **`BETTER_AUTH_URL`** — Required by Better Auth to construct redirect and verification URLs.
- **`NEXT_PUBLIC_API_URL`** — Required by both the Axios client (`frontend/src/lib/api.ts`) and the Better Auth React client (`frontend/src/lib/auth-client.ts`). All API calls will fail without it.
- **`NEXT_PUBLIC_APP_URL`** — Required for post-authentication redirects to `/dashboard`.

Optional settings have these defaults when absent:

| Variable | Default | Set In |
|---|---|---|
| `PORT` | `3030` | `backend/src/index.ts`: `process.env.PORT \|\| 3030` |
| `COOKIE_PREFIX` | Better Auth internal default | `backend/src/lib/auth.ts`, `frontend/src/proxy.ts` |

---

## Defaults

Better Auth ships with several runtime defaults that apply unless overridden by environment variables or code:

- **Cookie cache** — Enabled with a 1-hour (`3600s`) max age and `compact` strategy (`backend/src/lib/auth.ts`).
- **Auth rate limiting** — 10 requests per 15-minute window on all auth endpoints (`backend/src/lib/auth.ts`).
- **User currency** — Defaults to `"IDR"` (Indonesian Rupiah) for new users.
- **User timezone** — Defaults to `"Asia/Jakarta"` for new users.
- **Axios timeout** — 10,000 ms (`frontend/src/lib/api.ts`).

---

## Per-Environment Overrides

No `.env.development` or `.env.production` files are committed to the repository. Configuration is managed by providing the appropriate `.env.local` values per environment.

**Development (typical values):**

```bash
# backend/.env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kashin
BETTER_AUTH_URL=http://localhost:3030
FRONTEND_URL=http://localhost:3000
PORT=3030

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3030/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production:**

<!-- VERIFY: Production DATABASE_URL, BETTER_AUTH_URL, FRONTEND_URL, NEXT_PUBLIC_API_URL, and NEXT_PUBLIC_APP_URL values — set these in the deployment platform's secret manager, not in the repo. -->

Set production values as secrets in your hosting platform. Ensure `FRONTEND_URL` (backend) and `NEXT_PUBLIC_APP_URL` (frontend) point to the same deployed frontend domain, and that `BETTER_AUTH_URL` points to the deployed backend.

---

## Database

PostgreSQL is run via Docker Compose for local development:

- **Compose file:** `docker/postgres/docker-compose.yml`
- **Image:** `postgres:18-alpine`
- **Persistent volume:** `docker/postgres/data/`
- **Connection:** Configured via `DATABASE_URL` using the `pg` driver and `@prisma/adapter-pg` for Prisma 7.

Start the database before running the backend:

```bash
docker compose -f docker/postgres/docker-compose.yml up -d
```
