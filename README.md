<!-- generated-by: gsd-doc-writer -->
# Kashin

A personal expense and income tracker for individuals — log transactions, organize by category, and visualize spending. Future versions add AI-powered email receipt extraction.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend runtime | Bun + Elysia |
| Database | PostgreSQL 18 via Prisma 7 |
| Auth | Better Auth (email/password + Google OAuth) |
| Frontend | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4 + shadcn/ui |

## Prerequisites

- [Bun](https://bun.sh) >= 1.3.11 (backend runtime and package manager)
- [Node.js](https://nodejs.org) (frontend tooling via Next.js)
- [pnpm](https://pnpm.io) (frontend package manager)
- PostgreSQL 18

## Installation

**Backend**

```bash
cd backend && bun install
```

**Frontend**

```bash
cd frontend && pnpm install
```

## Quick Start

1. Set up environment variables:

   ```bash
   # backend/.env
   DATABASE_URL=postgresql://...
   BETTER_AUTH_URL=http://localhost:3030
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   FRONTEND_URL=http://localhost:3000
   COOKIE_PREFIX=kashin
   PORT=3030
   ```

2. Push the database schema:

   ```bash
   cd backend && bunx --bun prisma db push
   ```

3. Start the backend (port 3030):

   ```bash
   cd backend && bun run dev
   ```

4. Start the frontend (port 3000):

   ```bash
   cd frontend && pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kashin/
├── backend/          # Bun + Elysia API server (port 3030)
│   ├── src/
│   │   ├── modules/  # Domain modules (auth, category, transaction)
│   │   ├── lib/      # Prisma client, auth config
│   │   └── macros/   # Elysia auth guard macro
│   └── prisma/       # Schema + migrations
├── frontend/         # Next.js 16 app (port 3000)
│   └── src/
│       ├── app/      # App Router pages (auth, dashboard)
│       ├── features/ # Domain feature modules
│       └── components/ # Shared UI components
└── docker/           # PostgreSQL Docker setup
```

## Development

After any Prisma schema change, regenerate the client:

```bash
cd backend && bunx --bun prisma generate
```

See `backend/CLAUDE.md` and `frontend/CLAUDE.md` for per-package conventions and patterns.

## License

Private — all rights reserved.
