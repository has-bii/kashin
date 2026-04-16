# Graph Report - .  (2026-04-16)

## Corpus Check
- 304 files · ~180,236 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 536 nodes · 915 edges · 24 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Next.js Frontend App` - 5 edges
2. `getById()` - 4 edges
3. `update()` - 4 edges
4. `scheduleNext()` - 4 edges
5. `toggle()` - 4 edges
6. `resolveMonthRange()` - 3 edges
7. `handlePasskeyAction()` - 3 edges
8. `Finance / Budgeting Feature` - 3 edges
9. `delete()` - 2 edges
10. `buildMonthBuckets()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Frontend App` --conceptually_related_to--> `Finance / Budgeting Feature`  [INFERRED]
  frontend/README.md → frontend/public/images/calculator.webp
- `Next.js Wordmark SVG` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  frontend/public/next.svg → frontend/README.md
- `Vercel Logo SVG (Triangle)` --conceptually_related_to--> `Vercel Deployment Platform`  [INFERRED]
  frontend/public/vercel.svg → frontend/README.md
- `myBCA Mobile App Logo` --semantically_similar_to--> `BCA (Bank Central Asia) Logo`  [INFERRED] [semantically similar]
  frontend/public/images/bank/mybca.jpg → frontend/public/images/bank/bca-card.jpg
- `update()` --calls--> `getById()`  [EXTRACTED]
  backend/src/modules/budget/service.ts → backend/src/modules/bank-account/service.ts

## Communities

### Community 0 - "UI Component Library"
Cohesion: 0.04
Nodes (4): getDashboardCategoryBreakdownQueryKey(), getDashboardCategoryBreakdownQueryOptions(), getDashboardSummaryQueryKey(), getDashboardSummaryQueryOptions()

### Community 1 - "Dialog & Form Components"
Cohesion: 0.04
Nodes (6): DatetimePickerDate(), useDatetimePicker(), getCategoriesQueryKey(), getCategoriesQueryOptions(), getTransactionsQueryKey(), getTransactionsQueryOptions()

### Community 2 - "API Queries & Data Fetching"
Cohesion: 0.05
Nodes (8): getBanksQueryKey(), getBanksQueryOptions(), getDashboardRecentQueryKey(), getDashboardRecentQueryOptions(), getDashboardTrendsQueryKey(), getDashboardTrendsQueryOptions(), importStatusQueryKey(), importStatusQueryOptions()

### Community 3 - "Auth & Security Settings"
Cohesion: 0.05
Nodes (3): addPasskey(), handlePasskeyAction(), handleSavePasskeyname()

### Community 4 - "AI Email Extraction Service"
Cohesion: 0.06
Nodes (17): buildMonthBuckets(), categoryBreakdown(), convertHtmlToText(), createGmailClient(), delete(), fetchEmailByMessageId(), getById(), getPeriodRange() (+9 more)

### Community 5 - "Delete & Table Components"
Cohesion: 0.05
Nodes (4): getBudgetsQueryKey(), getBudgetsQueryOptions(), ResponsiveDialogFooter(), useResponsiveDialog()

### Community 6 - "Prisma Models & Database"
Cohesion: 0.1
Nodes (0): 

### Community 7 - "Skeleton Loaders & Page Layout"
Cohesion: 0.06
Nodes (0): 

### Community 8 - "Sidebar Avatar & Layouts"
Cohesion: 0.06
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 9 - "Indonesian Bank Integration"
Cohesion: 0.17
Nodes (13): Indonesian Bank Integration, Finance / Budgeting Feature, BCA (Bank Central Asia) Logo, Bank Jago Logo, myBCA Mobile App Logo, Calculator & Financial Charts Photo, create-next-app CLI, Geist Font (next/font) (+5 more)

### Community 10 - "Auth Middleware & Errors"
Cohesion: 0.2
Nodes (4): BadRequest, Conflict, Forbidden, Unauthorized

### Community 11 - "Recurring Transactions"
Cohesion: 0.29
Nodes (2): getRecurringTransactionsQueryKey(), getRecurringTransactionsQueryOptions()

### Community 12 - "Bank Account Queries"
Cohesion: 0.4
Nodes (2): getBankAccountsQueryKey(), getBankAccountsQueryOptions()

### Community 13 - "API Proxy"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Prisma Config"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Browser Utils"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Shared Models"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Prisma Browser Namespace"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Barrel Exports"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Next.js Type Env"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "File Icon Asset"
Cohesion: 1.0
Nodes (1): File Icon SVG

### Community 22 - "Globe Icon Asset"
Cohesion: 1.0
Nodes (1): Globe/Web Icon SVG

### Community 23 - "Browser Window Asset"
Cohesion: 1.0
Nodes (1): Browser Window Icon SVG

## Knowledge Gaps
- **9 isolated node(s):** `Geist Font (next/font)`, `create-next-app CLI`, `File Icon SVG`, `Vercel Logo SVG (Triangle)`, `Next.js Wordmark SVG` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `API Proxy`** (2 nodes): `proxy.ts`, `proxy()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Config`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Browser Utils`** (1 nodes): `browser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shared Models`** (1 nodes): `models.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Browser Namespace`** (1 nodes): `prismaNamespaceBrowser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Barrel Exports`** (1 nodes): `barrel.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Type Env`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Icon Asset`** (1 nodes): `File Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe Icon Asset`** (1 nodes): `Globe/Web Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Browser Window Asset`** (1 nodes): `Browser Window Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Geist Font (next/font)`, `create-next-app CLI`, `File Icon SVG` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Dialog & Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `API Queries & Data Fetching` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Auth & Security Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `AI Email Extraction Service` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Delete & Table Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._