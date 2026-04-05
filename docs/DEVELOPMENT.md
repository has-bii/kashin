<!-- generated-by: gsd-doc-writer -->
# Development

This document covers local setup, build commands, code style, and contribution workflow for Kashin. The project uses a split package structure: `backend/` (Bun + Elysia) and `frontend/` (Next.js 16), each with its own package manager and toolchain.

## Local Setup

### 1. Clone and enter the project

```bash
git clone <repository-url>
cd kashin
```

### 2. Start the database

PostgreSQL 18 runs in Docker Compose. Start it before the backend:

```bash
cd docker/postgres
docker compose up -d
```

The container exposes port `5432` with password `postgres` and persists data to `docker/postgres/data/`.

### 3. Install dependencies

Backend uses Bun; frontend uses pnpm — do not mix package managers.

```bash
# Backend
cd backend && bun install

# Frontend
cd frontend && pnpm install
```

### 4. Configure environment variables

Create `.env` files in each package (no shared root `.env`):

```bash
# Backend — backend/.env
cp backend/.env.example backend/.env   # if example exists, otherwise create manually
```

Backend required variables: `DATABASE_URL`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `COOKIE_PREFIX`, `PORT`.

Frontend required variables: API base URL pointing to `http://localhost:3030/api` (set in `frontend/src/lib/api.ts`).

See [CONFIGURATION.md](CONFIGURATION.md) for the full variable reference.

### 5. Generate Prisma client

Run after initial setup and after any schema changes:

```bash
cd backend
bunx --bun prisma generate
bunx --bun prisma db push
```

Prisma client outputs to `backend/src/generated/prisma/`. Prismabox validation schemas output to `backend/src/generated/prismabox/`. Neither directory should be edited manually.

## Build Commands

### Backend

| Command | Description |
|---|---|
| `bun run dev` | Start Elysia dev server on port 3030 with file watching |

Backend has no separate build step — `bun run dev` runs the TypeScript source directly.

### Frontend

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server on port 3000 |
| `pnpm build` | Compile and bundle for production (Next.js) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint across `src/` |

## Code Style

### Prettier

Both packages use Prettier 3.8.1 with consistent settings:

- Config: `backend/.prettierrc` and `frontend/.prettierrc`
- Print width: 100 characters
- Semicolons: disabled (`semi: false`)
- Quotes: double quotes (`singleQuote: false`)
- Import sorting: `@trivago/prettier-plugin-sort-imports` (both packages)
- Tailwind class sorting: `prettier-plugin-tailwindcss` (frontend only)

Prettier is not wired to a `package.json` script in either package — run it directly:

```bash
# Format all files in a package
cd backend && bunx prettier --write .
cd frontend && pnpm exec prettier --write .
```

### ESLint (frontend only)

- Config: `frontend/eslint.config.mjs`
- Ruleset: `eslint-config-next` (core-web-vitals + TypeScript)
- Plugin: `@tanstack/eslint-plugin-query` (flat/recommended)
- Override: `react/no-children-prop` is disabled
- Run: `pnpm lint` from `frontend/`

No ESLint is configured for the backend.

### TypeScript

- Backend: TypeScript 6, target ESNext, `nodenext` module resolution, strict mode
- Frontend: TypeScript 5, target ES2017, `bundler` module resolution, strict mode, incremental builds

### Key conventions

- Never use `React.memo`, `useMemo`, or `useCallback` in frontend code — the React 19 Compiler handles memoization automatically
- Always import Zod as `import { z } from "zod/v4"` in the frontend
- Backend uses relative imports (no path aliases); frontend uses `@/*` → `./src/*`
- Service methods take `userId` as the first parameter to enforce data scoping

## Adding a New Module

### Backend module

Use the `backend-module` skill. Reference implementation: `backend/src/modules/category/`.

Module structure:
```
src/modules/<name>/
  index.ts     — Elysia controller (route definitions, auth guards)
  service.ts   — Business logic (abstract class with static methods)
  query.ts     — Typebox query param schemas (if needed)
```

After creating or modifying `prisma/schema.prisma`, regenerate clients:

```bash
bunx --bun prisma generate
```

### Frontend feature

Use the `frontend-feature` skill. Reference implementation: `frontend/src/features/category/`.

Feature structure:
```
src/features/<name>/
  components/    — React components
  hooks/         — TanStack React Form hooks (use-<action>.ts)
  validations/   — Zod v4 schemas and inferred DTO types
  api/           — TanStack Query option objects (<name>.query.ts)
  types/         — TypeScript interfaces
```

## Branch Conventions

No branch naming convention is formally documented. No pull request template is present in `.github/`. Coordinate naming with the team before starting a branch.

## PR Process

No `.github/PULL_REQUEST_TEMPLATE.md` is present. Follow these general guidelines:

- Keep PRs scoped to a single module or feature
- Ensure `pnpm lint` passes before opening a PR (frontend)
- Run `bunx --bun prisma generate` and commit generated files if the Prisma schema changed
- Reference the relevant module or feature in the PR title (e.g., `feat(category): ...`)
- No CI pipeline is currently configured — tests and lint run locally only
