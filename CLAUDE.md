# Project Intelligence

## Project Type

Backend + Frontend in one repo

- `backend/` — Elysia + Bun API (TypeScript)
- `frontend/` — Next.js 16 App Router (React 19, TypeScript)

## Project Rules (READ BEFORE ANY TASK)

Before writing any code, read the relevant docs in `.claude/docs/`:

| Doc                    | When to Read                                   |
| ---------------------- | ---------------------------------------------- |
| `conventions.md`       | ALWAYS — before writing any code               |
| `tech-stack.md`        | When choosing how to implement something       |
| `project-structure.md` | When creating new files                        |
| `dependencies.md`      | When importing libraries or creating utils     |
| `env-and-config.md`    | When working with config, secrets, or env vars |

## Skills — Backend

Before implementing backend features, read the relevant skill in `.claude/skills/backend/`:

| Skill               | When to Read                                         |
| ------------------- | ---------------------------------------------------- |
| `endpoint.md`       | Creating new API routes or controllers               |
| `middleware.md`     | Adding auth, logging, or other cross-cutting plugins |
| `database.md`       | Writing Prisma queries, transactions, relations      |
| `validation.md`     | Defining body/query schemas (TypeBox + Prismabox)    |
| `error-handling.md` | Throwing or handling errors in services              |
| `response.md`       | Returning API responses (shape + status codes)       |
| `auth.md`           | Protecting routes, accessing current user            |
| `testing.md`        | Writing backend tests with Bun test                  |

## Skills — Frontend

Before implementing frontend features, read the relevant skill in `.claude/skills/frontend/`:

| Skill             | When to Read                                  |
| ----------------- | --------------------------------------------- |
| `component.md`    | Creating any React component                  |
| `query-api.md`    | Fetching data from the API (GET)              |
| `mutation.md`     | Deleting or non-form mutations                |
| `form.md`         | Building create/edit forms with TanStack Form |
| `routing.md`      | Adding new pages or routes                    |
| `url-state.md`    | Filters, tabs, pagination via URL (nuqs)      |
| `lazy-loading.md` | Code splitting with dynamic()                 |

## Hard Rules

- NEVER install new dependencies without asking the user first
- NEVER create files outside the defined project structure
- ALWAYS follow naming conventions from `conventions.md` — no exceptions
- ALWAYS use the specified libraries from `dependencies.md` — no substitutions
- ALWAYS check `project-structure.md` before creating a new file
- NEVER add `React.memo`, `useMemo`, or `useCallback` — React Compiler handles optimization
- NEVER add `staleTime`/`gcTime` per-query — set globally on QueryClient
- Frontend package manager: `pnpm` only — never `npm install`
- Backend package manager: `bun` only — never `npm install`
- When unsure, ASK — don't guess

## Context Navigation (Graphify + Obsidian)

### 3-Layer Query Rule
1. **First:** query `graphify-out/graph.json` or `graphify-out/wiki/index.md` to understand code structure and connections
2. **Second:** query `docs/logs/` for decisions, progress, and session context
3. **Third:** only read raw code files when editing or when the first two layers don't have the answer

### When to Update
- After modifying code: `graphify . --update` (only processes modified files)
- The graph is persistent — NO need to rebuild every session

### Do NOT
- Don't manually modify files inside `graphify-out/`
- Don't re-read the entire codebase if the graph already has the information

### Session Workflow
- **Start of session:** read the latest file in `docs/logs/` for context
- **End of session:** summarize what was built into `docs/logs/YYYY-MM-DD.md`
- **Architecture questions:** read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure
