# Environment & Config

## Env Files

- Backend: `backend/.env` (no `.env.example` found — check `backend/src/index.ts` and `lib/auth.ts` for required vars)
- Frontend: `frontend/.env.local` (Next.js convention)

## Variable Naming

- Backend: `SCREAMING_SNAKE_CASE`, no prefix (e.g., `PORT`, `DATABASE_URL`, `FRONTEND_URL`)
- Frontend: `NEXT_PUBLIC_` prefix for browser-exposed vars (e.g., `NEXT_PUBLIC_API_URL`)
- Frontend: no prefix for server-only vars

## Accessing Env Vars

- Backend (Bun/Elysia): `process.env.VAR_NAME` directly — no config module
- Frontend (Next.js): `process.env.NEXT_PUBLIC_VAR_NAME` in client code, `process.env.VAR_NAME` in server components/actions

## Known Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Server port (default `3030`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `FRONTEND_URL` | Allowed CORS origin (e.g., `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Better Auth session secret |
| `BETTER_AUTH_URL` | Better Auth server URL |

### Frontend

| Variable | Description | Public |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL (for Better Auth) | Yes |
