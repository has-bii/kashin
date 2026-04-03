# CLAUDE.md

## Project

Kashin — full-stack expense/income tracker with AI-powered email receipt processing.

## Architecture

- **`backend/`** — Bun + Elysia, Prisma 7 ORM, TiDB Cloud (MySQL serverless), Better Auth
- **`frontend/`** — Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, TanStack React Form

Each package has its own `CLAUDE.md` with directory maps.

## Commands

```bash
# Backend (port 3030)
cd backend && bun install && bun run dev
bunx --bun prisma generate   # after schema changes
bunx --bun prisma db push    # push schema to DB

# Frontend (port 3000)
cd frontend && pnpm install && pnpm dev
```

## Key conventions

- **IDs**: UUID v7 for user-facing tables, BigInt auto-increment for internal
- **DB adapter**: TiDB Cloud serverless via `@tidbcloud/prisma-adapter` (not standard MySQL)
- **No FK enforcement**: `relationMode = "prisma"` — always filter by `userId`
- **Validation**: Backend uses prismabox (auto-generated from Prisma). Frontend uses Zod v4
- **Styling**: Tailwind CSS 4 + shadcn/ui, `cn()` utility (clsx + tailwind-merge)
- **Formatting**: Prettier with import sorting + Tailwind class sorting

## Module registry

| Module   | Backend | Frontend | Status   |
| -------- | ------- | -------- | -------- |
| auth     | done    | done     | complete |
| category | done    | done     | complete |

## Skills

- **`backend-module`** — Use when creating a new backend API module
- **`frontend-feature`** — Use when creating a new frontend feature
