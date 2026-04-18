# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # start dev server with hot reload
bun run lint       # ESLint on ./src
bunx --bun prisma generate   # regenerate Prisma client after schema changes
bunx --bun prisma migrate dev  # run migrations in development
```

No test suite is configured. Type-check with `bunx tsc --noEmit`.

Default dev port is **3030** (override with `PORT` env var).

## Architecture

This is a **Bun + Elysia** REST API (personal finance backend). All routes are prefixed `/api` and registered in `src/index.ts`.

### Module structure

Every feature lives in `src/modules/<name>/` with three files:
- `index.ts` — Elysia controller (routes, input validation via `t.*` schemas)
- `service.ts` — business logic + Zod/Elysia body/query schemas
- `query.ts` — reusable query parameter schemas (when needed)

Exceptions:
- `ai-extraction/` — `index.ts` (controller), `service.ts`, `dto.ts` (no agent files)
- `email-processor/` — extended structure: `agent.ts`, `context-schema.ts`, `human-message.ts`, `response-format.ts`, `system-prompt.ts`, `tools.ts`, `service.ts`
- `webhook/` — receives inbound webhooks (e.g. QStash callbacks)

### Authentication

`better-auth` handles sessions. The `authMacro` (`src/macros/auth.macro.ts`) is an Elysia macro — add `.use(authMacro)` to a controller then pass `{ auth: true }` to any route handler to inject `user` and `session` into context. Unauthenticated requests throw `Unauthorized`.

### Database

Prisma with `@prisma/adapter-pg` (PostgreSQL driver). The client is a singleton at `src/lib/prisma.ts`. Schema is in `prisma/schema.prisma`. Generated client outputs to `src/generated/prisma/client`.

Key domain models: `User`, `Category`, `Transaction`, `RecurringTransaction`, `Budget`, `Bank`, `BankAccount`, `AiExtraction`, `UserSettings`.

### Background jobs

Inngest handles async work (`src/modules/inngest/`). Functions are defined in `functions.ts`, the client in `client.ts`. The handler is mounted at `/api/inngest`. Currently: email processing pipeline triggered by `email/process.email`.

QStash (`src/lib/qstash.ts`) is used for reliable webhook delivery/scheduling — distinct from Inngest. Inbound QStash callbacks hit the `webhook` module.

### AI / Email processing

`src/modules/email-processor/` contains a LangGraph agent (LangChain + Google Gemini/OpenAI) that parses financial emails and creates `AiExtraction` records. Gmail OAuth integration is in `src/modules/gmail/`.

### Shared lib utilities

`src/lib/` contains singletons used across modules:
- `prisma.ts` — Prisma client
- `auth.ts` — better-auth instance
- `llm.ts` — LLM client (Gemini/OpenAI)
- `qstash.ts` — QStash client
- `email.ts` — Resend email client
- `logger.ts` — pino logger
- `pg-listener.ts` — Postgres LISTEN/NOTIFY client (for SSE push)
- `progress-bus.ts` — in-process event bus bridging pg-listener to SSE streams

### SSE Progress Streaming

Import progress events flow: Postgres LISTEN/NOTIFY → `pg-listener.ts` → `progress-bus.ts` → SSE response. The `ai-extraction` module exposes an SSE endpoint; clients receive `processed`/`total` counters. No WebSockets.

### Rate limiting

Global rate limit: **100 req/60s** (applied in `src/index.ts`). Routes mounted before the limiter (`/api/health`, `/api/inngest`, `/api/auth/*`) bypass it.

### Error handling

Thrown errors with a `.status` property are returned as `{ error: string, code: string }` with that status. Elysia validation errors become 400. All others become 500. Throw typed errors from `src/global/error.ts`.

### Key env vars

`DATABASE_URL`, `PORT`, `FRONTEND_URL`, `INNGEST_*`, `BETTER_AUTH_SECRET`, `RESEND_*`, `GOOGLE_*` (OAuth + Gemini), `OPENAI_API_KEY`, `QSTASH_*`.

## Context Navigation (Graphify)

### 3-Layer Query Rule
1. **First:** query `graphify-out/graph.json` or `graphify-out/wiki/index.md`
   to understand code structure and connections
2. **Second:** query the Obsidian vault for decisions, progress, and project context
3. **Third:** only read raw code files when editing
   or when the first two layers don't have the answer

### When to rebuild the graph
- After structural changes (new modules, major refactors)
- Command: `graphify . --update` (only processes modified files)
- The graph is persistent — NO need to rebuild every session

### Do NOT
- Don't manually modify files inside `graphify-out/`
- Don't re-read the entire codebase if the graph already has the information