# Environment & Config

## Env Files

- `backend/.env.local` — backend secrets and config
- `frontend/.env.local` — frontend config

No `.env.example` files exist — refer to this doc for variable names.

## Backend Variables (`backend/.env.local`)

| Variable | Description |
|----------|-------------|
| `BETTER_AUTH_URL` | Backend URL (e.g., `http://localhost:3030`) |
| `BETTER_AUTH_SECRET` | Auth secret key |
| `PORT` | Server port (default: `3030`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `FRONTEND_URL` | Frontend origin for CORS |
| `COOKIE_PREFIX` | Cookie name prefix (e.g., `__a_k`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

## Frontend Variables (`frontend/.env.local`)

| Variable | Description | Public |
|----------|-------------|--------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | Yes |
| `COOKIE_PREFIX` | Cookie name prefix | No |

## Accessing Env Vars

- **Backend (Bun)**: `process.env.VAR_NAME` directly — no validation wrapper
- **Frontend**: `process.env.NEXT_PUBLIC_*` for public vars, `process.env.VAR_NAME` for server-side
- `NEXT_PUBLIC_*` prefix required for vars accessible in browser code
