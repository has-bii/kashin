# Project Intelligence

## Project Type

Backend + Frontend in one repo:
- `backend/` — Elysia + Bun API (PostgreSQL via Prisma 7, Better Auth)
- `frontend/` — Next.js 16 App Router (React 19, Tailwind 4, shadcn/ui, TanStack Query)

## Navigation

Use code-review-graph MCP tools to understand existing code structure and dependencies.
Do NOT read files to "explore" or "understand" the project.
Query the graph first, read files only when you need implementation details.

## Project Rules (READ BEFORE ANY TASK)

Before writing any code, read the relevant docs in `.claude/docs/`:

| Doc | When to Read |
|-----|-------------|
| `conventions.md` | ALWAYS — before writing any code |
| `tech-stack.md` | When choosing how to implement something |
| `project-structure.md` | When creating new files |
| `dependencies.md` | When importing libraries or creating utils |
| `env-and-config.md` | When working with config, secrets, or env vars |

## Skills — Backend

Before implementing backend features, read the relevant skill in `.claude/skills/backend/`:

| Skill | When to Read |
|-------|-------------|
| `endpoint.md` | Creating new API routes or modules |
| `middleware.md` | Adding auth, plugins, or per-route hooks |
| `database.md` | Writing queries, creating models, transactions |
| `validation.md` | Validating request input (body, query, params) |
| `error-handling.md` | Throwing or handling errors |
| `response.md` | Returning API responses |
| `auth.md` | Protecting routes, accessing current user |
| `testing.md` | Writing backend tests |

## Hard Rules

- NEVER install new dependencies without asking the user first
- NEVER create files outside the defined project structure
- ALWAYS follow naming conventions from `conventions.md`
- ALWAYS use the specified libraries from `dependencies.md` — no substitutions
- Backend: use `bun` commands (not `node`, not `npm`)
- Frontend: use `pnpm` commands (not `npm`, not `yarn`)
- React Compiler is active — never add `React.memo`, `useMemo`, or `useCallback`
- When unsure, ASK — don't guess
