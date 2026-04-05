<!-- generated-by: gsd-doc-writer -->
# Getting Started

Kashin is a personal expense and income tracker with a Bun + Elysia backend and a Next.js 16 frontend. This guide takes you from zero to a running local environment.

## Prerequisites

Before you begin, ensure the following tools are installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Bun | `>= 1.3.11` | Backend runtime and package manager |
| Node.js | LTS | Frontend tooling (Next.js) |
| pnpm | latest | Frontend package manager |
| Docker | latest | PostgreSQL 18 database container |

Install pnpm if you do not have it:

```bash
npm install -g pnpm
```

## Installation Steps

**1. Clone the repository**

```bash
git clone <repository-url>
cd kashin
```

**2. Start the PostgreSQL database**

```bash
cd docker/postgres
docker compose up -d
cd ../..
```

This starts a PostgreSQL 18-alpine container on port `5432` with the password `postgres`.

**3. Configure backend environment**

Create `backend/.env.local` with the following variables (see [CONFIGURATION.md](CONFIGURATION.md) for the full reference):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kashin
BETTER_AUTH_URL=http://localhost:3030
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONTEND_URL=http://localhost:3000
COOKIE_PREFIX=kashin
PORT=3030
```

**4. Configure frontend environment**

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3030/api
```

**5. Install backend dependencies**

```bash
cd backend
bun install
```

**6. Push the database schema**

```bash
bunx --bun prisma db push
cd ..
```

**7. Install frontend dependencies**

```bash
cd frontend
pnpm install
cd ..
```

## First Run

Open two terminal windows and run each service:

**Terminal 1 — Backend (port 3030):**

```bash
cd backend && bun run dev
```

You should see: `🦊 Elysia is running at http://localhost:3030`

**Terminal 2 — Frontend (port 3000):**

```bash
cd frontend && pnpm dev
```

Open `http://localhost:3000` in your browser. You will be redirected to `/auth/login`.

## Common Setup Issues

**Wrong Bun version**
The backend requires Bun `>= 1.3.11`. Check your version with `bun --version` and upgrade with `curl -fsSL https://bun.sh/install | bash`.

**Database connection refused**
Ensure the Docker container is running: `docker ps`. If it is not listed, re-run `docker compose up -d` from the `docker/postgres/` directory.

**Missing environment variable errors**
Both `.env.local` files must exist before starting the services. The backend will fail to start without `DATABASE_URL` and `BETTER_AUTH_URL`.

**Port already in use**
Backend defaults to port `3030` and frontend to `3000`. If either port is occupied, set `PORT=<other>` in `backend/.env.local` or run `pnpm dev -- -p <other>` for the frontend.

**pnpm not found for frontend**
The frontend uses pnpm exclusively. Do not use `npm install` in the `frontend/` directory — it will create the wrong lockfile.

**Prisma client not generated**
If you see import errors for `@prisma/client`, run `bunx --bun prisma generate` from the `backend/` directory.

## Next Steps

- [DEVELOPMENT.md](DEVELOPMENT.md) — Local development workflow, build commands, and code style
- [ARCHITECTURE.md](ARCHITECTURE.md) — System overview, component diagram, and key abstractions
- [CONFIGURATION.md](CONFIGURATION.md) — Full environment variable reference for both services
