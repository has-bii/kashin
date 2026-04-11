# Project Intelligence

## Project Type

Backend + Frontend in one repo
- `backend/` — Elysia + Bun API (TypeScript)
- `frontend/` — Next.js 16 App Router (React 19, TypeScript)

## Navigation

Use code-review-graph MCP tools to understand existing code structure and dependencies.
Do NOT read files to "explore" or "understand" the project.
Query the graph first, read files only when you need implementation details.

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

## Project Rules (READ BEFORE ANY TASK)

Before writing any code, read the relevant docs in `.claude/docs/`:

| Doc | When to Read |
|---|---|
| `conventions.md` | ALWAYS — before writing any code |
| `tech-stack.md` | When choosing how to implement something |
| `project-structure.md` | When creating new files |
| `dependencies.md` | When importing libraries or creating utils |
| `env-and-config.md` | When working with config, secrets, or env vars |

## Skills — Backend

Before implementing backend features, read the relevant skill in `.claude/skills/backend/`:

| Skill | When to Read |
|---|---|
| `endpoint.md` | Creating new API routes or controllers |
| `middleware.md` | Adding auth, logging, or other cross-cutting plugins |
| `database.md` | Writing Prisma queries, transactions, relations |
| `validation.md` | Defining body/query schemas (TypeBox + Prismabox) |
| `error-handling.md` | Throwing or handling errors in services |
| `response.md` | Returning API responses (shape + status codes) |
| `auth.md` | Protecting routes, accessing current user |
| `testing.md` | Writing backend tests with Bun test |

## Skills — Frontend

Before implementing frontend features, read the relevant skill in `.claude/skills/frontend/`:

| Skill | When to Read |
|---|---|
| `component.md` | Creating any React component |
| `query-api.md` | Fetching data from the API (GET) |
| `mutation.md` | Deleting or non-form mutations |
| `form.md` | Building create/edit forms with TanStack Form |
| `routing.md` | Adding new pages or routes |
| `url-state.md` | Filters, tabs, pagination via URL (nuqs) |
| `lazy-loading.md` | Code splitting with dynamic() |

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
