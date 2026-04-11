---
description: Generate project intelligence docs (conventions, stack, structure, dependencies, env config). Supports --mode=scan|interview|hybrid and --scope=all|conventions|tech-stack|project-structure|dependencies|env-and-config.
argument-hint: "[--mode=hybrid] [--scope=all]"
allowed-tools: Read, Glob, Grep, Bash(cat:*), Bash(ls:*), Bash(find:*)
---

# Generate Project Documentation

You are generating project intelligence docs for `.claude/docs/`. These docs help AI coding agents (like you) understand the project conventions, stack, and structure — so they never need to "explore" the codebase.

## Parameters

Parse the arguments from `$ARGUMENTS`. Supported flags:

- `--mode=scan` — Auto-analyze the codebase to generate docs. Read config files and sample source files to infer conventions.
- `--mode=interview` — Ask the user structured questions, then generate docs from their answers.
- `--mode=hybrid` (DEFAULT if not specified) — Auto-detect what you can from config files, present findings to user for confirmation, ask questions only for what you can't infer.
- `--scope=all` (DEFAULT) — Generate all docs. Or specify one or more comma-separated: `conventions`, `tech-stack`, `project-structure`, `dependencies`, `env-and-config`.

If no arguments provided, default to `--mode=hybrid --scope=all`.

## Output Location

All generated docs go in `.claude/docs/`. After generating docs, also regenerate `CLAUDE.md` (the router file).

---

## STEP 0: Identify Project Type (ALWAYS DO THIS FIRST)

Before anything else, ask the user:

```
What type of project is this?

1. Frontend only (SPA — React Vite, Tanstack Router, etc.)
2. Backend only (API — Express, NestJS, Elysia, etc.)
3. Full-stack single framework (e.g., Next.js with API routes)
4. Monorepo (multiple packages/apps in one repo)
5. Backend + Frontend in one repo (separate folders, separate frameworks)
```

Wait for their answer. This determines:

- Which scopes are relevant (e.g., frontend-only skips backend sections)
- What questions to ask
- What config files to look for
- How project-structure.md is organized

Store their answer as `PROJECT_TYPE` and use it throughout.

---

## STEP 1: Identify Specific Stack

Based on `PROJECT_TYPE`, ask about the specific frameworks. Only ask what's relevant.

### If PROJECT_TYPE includes backend:

```
Which backend framework?
- Express
- NestJS
- Elysia (Bun)
- Next.js API routes only
- Other (specify)
```

### If PROJECT_TYPE includes frontend:

```
Which frontend framework/setup?
- React + Vite (SPA)
- React + Tanstack Router
- Next.js (App Router / Pages Router?)
- Other (specify)
```

### If PROJECT_TYPE is monorepo:

```
What's in the monorepo?
- Which apps? (e.g., web, api, mobile, admin)
- What tool manages the monorepo? (Turborepo, Nx, pnpm workspaces, yarn workspaces)
- Shared packages? (e.g., shared types, UI library, config)
```

### If PROJECT_TYPE is backend + frontend in one repo:

```
How is it structured?
- Folder names? (e.g., /client + /server, /frontend + /backend, /web + /api)
- Do they share anything? (types, config, etc.)
```

Store their answers as `STACK_INFO` and use it to tailor all generated docs.

---

## STEP 2: Generate Docs Based on Mode

Now proceed with the selected mode (scan / interview / hybrid), but adapt ALL questions and scanning targets based on `PROJECT_TYPE` and `STACK_INFO`.

---

## MODE: scan

Read config files and infer conventions. What to read depends on `PROJECT_TYPE`:

### Common (all project types)

- `package.json` (or root + workspace `package.json` files for monorepo)
- `tsconfig.json` / `jsconfig.json`
- `.eslintrc*` / `eslint.config.*` / `biome.json`
- `.prettierrc*`
- `.env.example` / `.env.local.example`
- Read 3-5 source files from different directories to detect naming patterns

### Backend-specific

- `nest-cli.json` (NestJS)
- `src/app.module.ts` or `src/main.ts` (NestJS)
- `src/index.ts` or `src/app.ts` (Express / Elysia)
- ORM config: `prisma/schema.prisma`, `ormconfig.ts`, `drizzle.config.ts`, `src/db/schema.ts`
- `docker-compose.yml` / `Dockerfile`

### Frontend-specific

- `vite.config.*` (Vite)
- `next.config.*` (Next.js)
- `app/routes/` or route config (Tanstack Router)
- Styling: check for `tailwind.config.*`, `postcss.config.*`, CSS modules usage
- Component library: check for `components.json` (shadcn/ui)

### Monorepo-specific

- `turbo.json` (Turborepo)
- `nx.json` (Nx)
- Root `pnpm-workspace.yaml` / root `package.json` workspaces field
- Each app/package's own `package.json`

After scanning, present ALL findings to the user and ask: "Does this look correct? Anything to add or change?" Then generate the docs.

---

## MODE: interview

Ask questions per scope. Adapt based on `PROJECT_TYPE` — skip irrelevant questions.

### conventions

1. What's your file naming convention? (kebab-case / camelCase / PascalCase / other)
2. What's your function/variable naming convention? (camelCase / snake_case / other)
3. Do you use default exports or named exports?
4. Do you use barrel files (index.ts re-exports)?
5. Any other naming rules? (e.g., components PascalCase, hooks prefixed with `use`, services suffixed with `.service`, etc.)

### tech-stack (ask only what's relevant to PROJECT_TYPE)

**Backend (if applicable):**

1. What database? (PostgreSQL, MySQL, SQLite, MongoDB, etc.)
2. What ORM/query builder? (Prisma, Drizzle, TypeORM, Mongoose, Kysely, etc.)
3. What auth approach? (JWT, session, OAuth provider, auth library like Lucia/NextAuth/BetterAuth, etc.)
4. Any caching layer? (Redis, in-memory, none)
5. Any job queue? (BullMQ, Agenda, none)

**Frontend (if applicable):**

1. What styling approach? (Tailwind, CSS Modules, styled-components, vanilla CSS, etc.)
2. What component library? (shadcn/ui, Radix, Headless UI, MUI, custom, none)
3. What testing setup? (Vitest, Jest, Playwright, Cypress, none yet)

**Both/General:**

1. Runtime? (Node.js version, Bun, Deno)
2. Package manager? (npm, pnpm, yarn, bun)
3. Any other key tools or services?

### project-structure

1. What's your source code root? (e.g., `src/`, `app/`, root)
2. How do you organize code? (feature-based modules / layer-based / hybrid)
3. Where do new API routes/endpoints go? (if backend)
4. Where do new UI components go? (if frontend)
5. Where do shared utilities go?
6. Where do tests live? (colocated / separate `__tests__` / top-level `tests/`)

**If monorepo:** 7. What apps exist and what does each do? 8. What shared packages exist? 9. Any cross-app dependencies or conventions?

**If backend + frontend in one repo:** 7. What are the folder names for each? 8. Do they share types or config?

### dependencies (ask only what's relevant)

**Backend (if applicable):**

1. What library for validation? (zod, class-validator, joi, typebox, etc.)
2. Any custom middleware patterns or shared utilities?

**Frontend (if applicable):**

1. What for server state? (React Query / TanStack Query, SWR, tRPC, none)
2. What for client state? (zustand, jotai, Redux, Context, signals, none)
3. What for forms? (React Hook Form, Formik, Tanstack Form, native)
4. What for HTTP requests? (fetch, axios, ky, tRPC, or framework built-in)
5. What for icons? (lucide-react, heroicons, react-icons, etc.)
6. What for date handling? (date-fns, dayjs, native Intl, etc.)

**General:** 7. Any internal wrappers the agent should always use instead of raw imports? 8. Any libraries explicitly banned? (e.g., "no moment.js, use date-fns")

### env-and-config

1. Where's your env example file?
2. Any env var naming convention? (prefix, casing)
3. How do you access env vars in code? (direct `process.env`, a config module, validated with zod, `import.meta.env`, etc.)
4. Any public/private distinction? (e.g., `NEXT_PUBLIC_*`, `VITE_*` prefix)

After each scope, generate that doc immediately. Then move to the next scope.

---

## MODE: hybrid

1. First, silently read config files based on `PROJECT_TYPE` (DO NOT read source code yet):
   - `package.json` (all of them in monorepo)
   - `tsconfig.json`
   - Linter/formatter configs
   - Framework config files (based on what they told you in Step 1)
   - `.env.example`
   - `docker-compose.yml` (if exists)
   - Top-level directory listing (1 level deep under source roots)

2. Present findings as a compact summary tailored to their project type:

   **Example for full-stack Next.js:**

   ```
   Here's what I detected:

   Type: Full-stack Next.js
   Framework: Next.js 15 (App Router), React 19
   Language: TypeScript 5.x (strict)
   ORM: Prisma 5.x → PostgreSQL
   Styling: Tailwind CSS 4
   Testing: Vitest
   Package manager: pnpm

   Confirm or correct?
   ```

   **Example for backend only (NestJS):**

   ```
   Here's what I detected:

   Type: Backend API
   Framework: NestJS 10
   Runtime: Node.js 20
   ORM: Prisma 5.x → PostgreSQL
   Cache: Redis via @nestjs/cache-manager
   Queue: BullMQ
   Testing: Jest
   Package manager: npm

   Confirm or correct?
   ```

   **Example for frontend only (React Vite):**

   ```
   Here's what I detected:

   Type: Frontend SPA
   Framework: React 19 + Vite 6
   Router: Tanstack Router
   Language: TypeScript 5.x
   Styling: Tailwind CSS 4
   UI: shadcn/ui
   Testing: Vitest + Playwright
   Package manager: pnpm

   Confirm or correct?
   ```

   **Example for monorepo:**

   ```
   Here's what I detected:

   Type: Monorepo (Turborepo + pnpm workspaces)
   Apps:
     - apps/web: React + Vite (frontend)
     - apps/api: Elysia + Bun (backend)
   Packages:
     - packages/shared: shared types + validators
     - packages/ui: component library

   Confirm or correct?
   ```

   **Example for backend + frontend in one repo:**

   ```
   Here's what I detected:

   Type: Backend + Frontend in one repo
   Backend: /server — Express + TypeScript
   Frontend: /client — React + Vite
   Shared: /shared — types
   Database: PostgreSQL via Drizzle
   Package manager: pnpm

   Confirm or correct?
   ```

3. Then ask ONLY about what you couldn't detect (naming conventions, preferred libraries, internal wrappers, folder rules).

4. Generate all docs from combined info.

---

## Doc Templates

When generating each doc, follow these templates. **Adapt sections based on PROJECT_TYPE** — omit irrelevant sections entirely (no backend section for frontend-only, no frontend section for backend-only). Keep them SHORT.

### .claude/docs/conventions.md

```markdown
# Conventions

## File Naming

- [List actual patterns detected/confirmed]
- [Only include what's relevant to this stack]

## Code Naming

- Variables/functions: [detected/confirmed convention]
- Types/interfaces: [detected/confirmed convention]
- Constants: [detected/confirmed convention]
- [Add more based on project]

## Exports

- [Export conventions for this project]

## Other Rules

- [Any project-specific conventions]
```

### .claude/docs/tech-stack.md

Generate ONLY sections relevant to `PROJECT_TYPE`:

```markdown
# Tech Stack

## [Section per relevant layer — only include what applies]

- Framework + version
- Language + version
- Key libraries + versions
- Runtime

## Key Decisions

- [Architectural decisions that affect how code is written]
```

### .claude/docs/project-structure.md

Adapt based on `PROJECT_TYPE` and `STACK_INFO`:

```markdown
# Project Structure

## Where to Put New Things

| What                           | Where         | Example          |
| ------------------------------ | ------------- | ---------------- |
| [Items relevant to THIS stack] | [Actual path] | [Actual example] |

## Organization Pattern

[Actual pattern used in this project]

## [Module/Feature/Package] Structure

[Template for creating new modules/features in this specific stack]
```

**For monorepo, add:**

```markdown
## Workspace Layout

| App/Package | Path   | Purpose        |
| ----------- | ------ | -------------- |
| [app name]  | [path] | [what it does] |

## Cross-App Rules

- [Where shared types go]
- [How to add dependency between packages]
- [Import restrictions]
```

**For backend + frontend in one repo, add:**

```markdown
## Repo Layout

- `[frontend-folder]/` — [frontend framework]
- `[backend-folder]/` — [backend framework]
- `[shared-folder]/` — [if exists, what's shared]
```

### .claude/docs/dependencies.md

```markdown
# Dependencies

## Use These Libraries (do NOT substitute)

| Purpose                              | Library | Import From |
| ------------------------------------ | ------- | ----------- |
| [Only what's relevant to this stack] |         |             |

## Internal Utilities (prefer over raw libraries)

| What                              | Use This | NOT This |
| --------------------------------- | -------- | -------- |
| [Custom wrappers in this project] |          |          |

## Do NOT Install

- [Banned/redundant packages]
```

### .claude/docs/env-and-config.md

```markdown
# Environment & Config

## Env Files

- [Actual env files in this project]

## Variable Naming

- Prefix: [Actual prefix or none]
- Casing: [Actual casing]

## Accessing Env Vars

- [How THIS project handles env access]

## Required Variables

| Variable                   | Description | Public |
| -------------------------- | ----------- | ------ |
| [From actual .env.example] |             |        |
```

---

## After Generating All Docs

Generate or update `CLAUDE.md`:

```markdown
# Project Intelligence

## Project Type

[PROJECT_TYPE and brief description — e.g., "Monorepo: web (React Vite) + api (Elysia)"]

## Navigation

Use code-review-graph MCP tools to understand existing code structure and dependencies.
Do NOT read files to "explore" or "understand" the project.
Query the graph first, read files only when you need implementation details.

## Project Rules (READ BEFORE ANY TASK)

Before writing any code, read the relevant docs in `.claude/docs/`:

| Doc                    | When to Read                                   |
| ---------------------- | ---------------------------------------------- |
| `conventions.md`       | ALWAYS — before writing any code               |
| `tech-stack.md`        | When choosing how to implement something       |
| `project-structure.md` | When creating new files                        |
| `dependencies.md`      | When importing libraries or creating utils     |
| `env-and-config.md`    | When working with config, secrets, or env vars |

## Skills (Implementation Patterns)

Before implementing a specific type of feature, read the relevant skill in `.claude/skills/`:
(skills to be added — run /generate-project-skills)

## Hard Rules

- NEVER install new dependencies without asking the user first
- NEVER create files outside the defined project structure
- ALWAYS follow naming conventions from conventions.md — no exceptions
- ALWAYS use the specified libraries from dependencies.md — no substitutions
- ALWAYS check project-structure.md before creating a new file
- When unsure, ASK — don't guess
```

Finally, tell the user:

```
Done! Project docs generated in .claude/docs/
Router updated at CLAUDE.md

Next steps:
1. Review the generated docs and correct anything that's off
2. Run /generate-project-skills to add implementation patterns (coming soon)
3. Install code-review-graph for codebase navigation:
   pip install code-review-graph && code-review-graph install && code-review-graph build
```
