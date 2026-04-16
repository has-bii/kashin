# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kashin** — Personal expense & income tracker with AI-powered email receipt extraction. Monorepo with separate backend and frontend.

- `backend/` — Elysia + Bun API (TypeScript)
- `frontend/` — Next.js 16 App Router (React 19, TypeScript)

## Development Commands

### Backend (Bun)

```bash
cd backend
bun run dev          # Start dev server (port 3030, watch mode)
bun run lint         # ESLint
bun test             # Run tests with Bun test runner
bunx prisma generate # Regenerate Prisma client + Prismabox schemas
bunx prisma migrate dev  # Create and apply migration
bunx prisma studio   # DB GUI browser
bunx prisma db seed  # Seed database
```

### Frontend (pnpm)

```bash
cd frontend
pnpm dev             # Start dev server (port 3000)
pnpm build           # Production build
pnpm lint            # ESLint
pnpm test            # Vitest (single run)
```

## Architecture

### Backend Module Pattern

Each domain lives in `backend/src/modules/{domain}/` with exactly 3 files:
- `index.ts` — Elysia controller (routes, auth guards, body/query validation)
- `query.ts` — Zod query param schemas
- `service.ts` — Business logic + Prisma calls (exported as `{Domain}Service` class)

Register controllers in `backend/src/index.ts`. Auth macros in `backend/src/macros/`. Shared libs in `backend/src/lib/` (prisma, auth, llm, qstash, html-to-text).

### Frontend Feature Pattern

Domain code lives in `frontend/src/features/{domain}/` with subfolders:
- `components/` — React components
- `hooks/` — Custom hooks (queries, mutations, form logic)
- `api/` — Query/mutation definitions
- `validations/` — Zod schemas for forms
- `types/` — Domain types

Pages in `frontend/src/app/` consume these features. Shared components in `frontend/src/components/`. UI primitives from shadcn in `components/ui/`. `@/` maps to `frontend/src/`.

### Key Pipelines

**Email → AI → Transaction:** Gmail API fetches emails → Inngest background jobs process them → LangChain LLM extracts transaction data → stored as AiExtraction → user confirms/rejects → becomes Transaction.

**Integrations:** Better Auth (session-based auth), Inngest (background jobs), Upstash QStash (HTTP scheduling), LangChain + Google GenAI/OpenAI (LLM extraction), Google APIs (Gmail OAuth).

### Database

PostgreSQL via Prisma 7. Schema at `backend/prisma/schema.prisma`. Generated client at `backend/src/generated/prisma/`. Prismabox generates Elysia TypeBox schemas from Prisma models at `backend/src/generated/prismabox/`. Both are auto-generated — never edit directly.

PK strategy: UUID v7 for user-facing tables, BigInt auto-increment for internal tables (EmailLog).

## Project Rules

Before writing code, read the relevant doc in `.claude/docs/`:

| Doc | When |
|---|---|
| `conventions.md` | ALWAYS — naming, exports, formatting rules |
| `tech-stack.md` | Choosing libraries or approaches |
| `project-structure.md` | Creating new files |
| `dependencies.md` | Importing libraries or creating utils |
| `env-and-config.md` | Config, secrets, env vars |

Backend skills in `.claude/skills/backend/` (endpoint, middleware, database, validation, error-handling, response, auth, testing). Frontend skills in `.claude/skills/frontend/` (component, query-api, mutation, form, routing, url-state, lazy-loading).

## Hard Rules

- NEVER install new dependencies without asking first
- NEVER create files outside the defined project structure
- ALWAYS follow naming conventions from `conventions.md`
- ALWAYS use specified libraries from `dependencies.md` — no substitutions
- NEVER add `React.memo`, `useMemo`, or `useCallback` — React Compiler handles this
- NEVER add `staleTime`/`gcTime` per-query — set globally on QueryClient
- Frontend: `pnpm` only. Backend: `bun` only. Never `npm install`.
- Backend: named exports only — no default exports. Frontend: default export for pages (framework requirement), named for components.
- Use internal utilities: `import { api } from "@/lib/api"`, `import { prisma } from "./lib/prisma"`, `import { auth } from "./lib/auth"` — never raw imports.
- When unsure, ASK — don't guess

## Context Navigation (Graphify)

**Skill:** Use `.claude/skills/codebase-explore/SKILL.md` whenever exploring the codebase — it implements the full 3-layer query workflow with context-mode tools.

### 3-Layer Query Rule
1. **First:** query `graphify-out/graph.json`
   to understand code structure and connections
2. **Second:** query the Obsidian vault (`~/vault/projects/Catatt/`) for decisions, progress, and project context
3. **Third:** only read raw code files when editing
   or when the first two layers don't have the answer

### When to rebuild the graph
- After structural changes (new modules, major refactors)
- Command: `graphify . --update` (only processes modified files)
- The graph is persistent — NO need to rebuild every session

### Do NOT
- Don't manually modify files inside `graphify-out/`
- Don't re-read the entire codebase if the graph already has the information

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
