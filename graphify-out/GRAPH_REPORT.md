# Graph Report - .  (2026-04-14)

## Corpus Check
- Large corpus: 294 files · ~178,259 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 542 nodes · 925 edges · 24 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Kashin — AI-Powered Expense & Income Tracker` - 8 edges
2. `Kashin Project Intelligence (CLAUDE.md)` - 8 edges
3. `getById()` - 4 edges
4. `update()` - 4 edges
5. `scheduleNext()` - 4 edges
6. `toggle()` - 4 edges
7. `fetchEmailFromGmail()` - 4 edges
8. `Supported Indonesian Banks (Jago, BCA)` - 4 edges
9. `handlePasskeyAction()` - 3 edges
10. `resolveMonthRange()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Calculator on Financial Charts — Hero/Marketing Image for Expense Tracking` --semantically_similar_to--> `Dashboard — Income vs Expenses Overview`  [INFERRED] [semantically similar]
  frontend/public/images/calculator.webp → PROJECT_BREIF.md
- `Supported Indonesian Banks (Jago, BCA)` --conceptually_related_to--> `AI Email Parsing Feature`  [INFERRED]
  frontend/public/images/bank/jago.jpg → PROJECT_BREIF.md
- `Kashin — AI-Powered Expense & Income Tracker` --conceptually_related_to--> `Kashin Project Intelligence (CLAUDE.md)`  [INFERRED]
  PROJECT_BREIF.md → CLAUDE.md
- `Kashin Project Intelligence (CLAUDE.md)` --conceptually_related_to--> `Kashin Obsidian Vault Instructions`  [INFERRED]
  CLAUDE.md → docs/CLAUDE.md
- `Frontend README — Next.js Bootstrap` --implements--> `Frontend — Next.js 16 App Router (React 19, TypeScript)`  [INFERRED]
  frontend/README.md → CLAUDE.md

## Hyperedges (group relationships)
- **Kashin Core App Architecture — Brief, Backend, Frontend** — project_brief_kashin, claude_md_backend_elysia_bun, claude_md_frontend_nextjs [EXTRACTED 1.00]
- **AI Email Processing Pipeline — Email Parsing, Background Jobs, Real-time SSE** — project_brief_ai_email_parsing, project_brief_background_jobs, project_brief_realtime_sse [EXTRACTED 0.95]
- **Graphify Session Knowledge Workflow — Graph Output, Session Logs, Graphify Notes** — claude_md_graphify_workflow, docs_claude_md_session_logs, docs_claude_md_graphify_notes [EXTRACTED 0.95]

## Communities

### Community 0 - "UI Primitives"
Cohesion: 0.05
Nodes (4): DatetimePickerDate(), useDatetimePicker(), getCategoriesQueryKey(), getCategoriesQueryOptions()

### Community 1 - "Feature Business Logic"
Cohesion: 0.04
Nodes (8): getDashboardRecentQueryKey(), getDashboardRecentQueryOptions(), getDashboardSummaryQueryKey(), getDashboardSummaryQueryOptions(), getDashboardTrendsQueryKey(), getDashboardTrendsQueryOptions(), importStatusQueryKey(), importStatusQueryOptions()

### Community 2 - "UI Component Library"
Cohesion: 0.05
Nodes (2): getDashboardCategoryBreakdownQueryKey(), getDashboardCategoryBreakdownQueryOptions()

### Community 3 - "Core API & Domain Models"
Cohesion: 0.1
Nodes (0): 

### Community 4 - "Skeleton Loading States"
Cohesion: 0.06
Nodes (0): 

### Community 5 - "Passkey Authentication"
Cohesion: 0.07
Nodes (7): addPasskey(), handlePasskeyAction(), handleSavePasskeyname(), getBudgetsQueryKey(), getBudgetsQueryOptions(), ResponsiveDialogFooter(), useResponsiveDialog()

### Community 6 - "Data Table & Interactions"
Cohesion: 0.06
Nodes (0): 

### Community 7 - "App Layout & Navigation"
Cohesion: 0.07
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 8 - "Backend Service Layer"
Cohesion: 0.09
Nodes (22): buildMonthBuckets(), categoryBreakdown(), createGmailClient(), decodeGmailMessage(), delete(), fetchEmailFromGmail(), getById(), getPeriodRange() (+14 more)

### Community 9 - "Auth & Permissions"
Cohesion: 0.07
Nodes (0): 

### Community 10 - "Project Docs & Conventions"
Cohesion: 0.09
Nodes (26): Backend — Elysia + Bun API (TypeScript), Backend Skills Directory (.claude/skills/backend/), Frontend — Next.js 16 App Router (React 19, TypeScript), Frontend Skills Directory (.claude/skills/frontend/), Rationale: staleTime/gcTime Set Globally on QueryClient — No Per-Query Config, Graphify 3-Layer Query Workflow, Hard Rules — Package Managers, React Compiler, No Manual Memo, Kashin Project Intelligence (CLAUDE.md) (+18 more)

### Community 11 - "Recurring Transactions"
Cohesion: 0.14
Nodes (4): getRecurringTransactionsQueryKey(), getRecurringTransactionsQueryOptions(), getTransactionsQueryKey(), getTransactionsQueryOptions()

### Community 12 - "Bank Selection UI"
Cohesion: 0.2
Nodes (2): getBanksQueryKey(), getBanksQueryOptions()

### Community 13 - "Email AI Pipeline"
Cohesion: 0.25
Nodes (0): 

### Community 14 - "Error Handling"
Cohesion: 0.22
Nodes (4): BadRequest, Conflict, Forbidden, Unauthorized

### Community 15 - "Bank Accounts List"
Cohesion: 0.4
Nodes (2): getBankAccountsQueryKey(), getBankAccountsQueryOptions()

### Community 16 - "API Proxy"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Prisma Config"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Browser Client"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Data Models"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Prisma Browser Namespace"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Barrel Exports"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **12 isolated node(s):** `Expense CRUD Feature`, `Income CRUD Feature`, `Reports & Export (CSV/PDF)`, `Real-time Updates via SSE`, `Backend — Elysia + Bun API (TypeScript)` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `API Proxy`** (2 nodes): `proxy.ts`, `proxy()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Config`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Browser Client`** (1 nodes): `browser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Models`** (1 nodes): `models.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Browser Namespace`** (1 nodes): `prismaNamespaceBrowser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Barrel Exports`** (1 nodes): `barrel.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `Kashin Project Intelligence (CLAUDE.md)` (e.g. with `Kashin Obsidian Vault Instructions` and `Kashin — AI-Powered Expense & Income Tracker`) actually correct?**
  _`Kashin Project Intelligence (CLAUDE.md)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Expense CRUD Feature`, `Income CRUD Feature`, `Reports & Export (CSV/PDF)` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Feature Business Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Core API & Domain Models` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Skeleton Loading States` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._