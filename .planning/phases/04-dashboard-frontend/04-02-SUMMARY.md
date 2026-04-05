---
phase: 04-dashboard-frontend
plan: "02"
subsystem: frontend
tags: [dashboard, section-cards, recent-transactions, tanstack-query, vitest, tdd]
dependency_graph:
  requires: [04-01]
  provides: [SectionCards, RecentTransactionsWidget]
  affects: [04-03]
tech_stack:
  added: []
  patterns: [useSuspenseQuery, UserWithProfile-cast, jest-dom-vitest-setup]
key_files:
  created:
    - frontend/src/features/dashboard/components/SectionCards.tsx
    - frontend/src/features/dashboard/components/RecentTransactionsWidget.tsx
    - frontend/src/__tests__/setup.ts
  modified:
    - frontend/src/__tests__/dashboard/balance-card.test.tsx
    - frontend/src/__tests__/dashboard/recent-transactions.test.tsx
    - frontend/vitest.config.ts
decisions:
  - TransactionType enum values are lowercase (income/expense) not uppercase — matched to existing enums.ts
  - Cast session.data.user to UserWithProfile for currency field — Better Auth additionalFields not in base type
  - jest-dom must be imported from @testing-library/jest-dom/vitest (not /jest-dom) for vitest expect compatibility
  - Use unknown intermediary when casting partial mock objects to strict Better Auth return types
metrics:
  duration_minutes: 15
  completed_date: "2026-04-05"
  tasks_completed: 2
  files_created: 3
  files_modified: 3
---

# Phase 04 Plan 02: Widget Components with Live Data Summary

**One-liner:** SectionCards (4-card balance summary with savings rate) and RecentTransactionsWidget (last 10 transactions list) wired to live API via useSuspenseQuery, with 10 passing TDD tests.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build SectionCards with live summary data and savings rate | 2b70728 | SectionCards.tsx, balance-card.test.tsx, setup.ts, vitest.config.ts |
| 2 | Build RecentTransactionsWidget with live data | 74409fc | RecentTransactionsWidget.tsx, recent-transactions.test.tsx |

## Artifacts Produced

- **`frontend/src/features/dashboard/components/SectionCards.tsx`** — 4-card grid consuming `useSuspenseQuery(getDashboardSummaryQueryOptions({}))`. Savings rate computed as `(netBalance / totalIncome) * 100`; shows em-dash when income is zero. Positive/negative/zero net balance renders distinct Badge variants. 106 lines.
- **`frontend/src/features/dashboard/components/RecentTransactionsWidget.tsx`** — List of up to 10 transactions via `useSuspenseQuery(getDashboardRecentQueryOptions({ limit: 10 }))`. Income amounts in `text-primary`, expense in `text-destructive`. Empty state shows "No transactions yet" + "Add your first transaction to get started." 73 lines.
- **`frontend/src/__tests__/setup.ts`** — Imports `@testing-library/jest-dom/vitest` to extend vitest `expect` with DOM matchers.

## Verification

- `vitest run src/__tests__/dashboard/` — 4 test files, 15 tests, 0 failures
- `npx tsc --noEmit` — exits 0, no errors
- SectionCards uses `useSuspenseQuery` (confirmed)
- RecentTransactionsWidget uses `useSuspenseQuery` with `limit: 10` (confirmed)
- Both components use `authClient.useSession()` cast to `UserWithProfile` for currency (confirmed)
- No hardcoded `"$"` in component rendering logic (confirmed)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] vitest not installed in node_modules**
- **Found during:** Task 1 RED phase
- **Issue:** `pnpm install` had not been run in this worktree; vitest binary missing
- **Fix:** Ran `pnpm install` to restore all devDependencies
- **Files modified:** none (dependency restoration)
- **Commit:** 2b70728 (pnpm-lock.yaml included)

**2. [Rule 1 - Bug] jest-dom setup used wrong entry point**
- **Found during:** Task 1 GREEN phase
- **Issue:** `import "@testing-library/jest-dom"` throws "expect is not defined" in vitest context
- **Fix:** Changed to `import "@testing-library/jest-dom/vitest"` and added setupFiles to vitest.config.ts
- **Files modified:** frontend/src/__tests__/setup.ts, frontend/vitest.config.ts
- **Commit:** 2b70728

**3. [Rule 1 - Bug] TransactionType values were uppercase in component and tests**
- **Found during:** Task 2 TypeScript check
- **Issue:** `tx.type === "INCOME"` never matches `TransactionType` ("income" | "expense"); test fixtures used `"EXPENSE"` which is not assignable
- **Fix:** Changed all occurrences to lowercase in RecentTransactionsWidget.tsx and recent-transactions.test.tsx
- **Files modified:** RecentTransactionsWidget.tsx, recent-transactions.test.tsx
- **Commit:** 74409fc

**4. [Rule 1 - Bug] currency field missing from base Better Auth user type**
- **Found during:** Task 2 TypeScript check
- **Issue:** `session.data.user.currency` does not exist on base user type; currency is an additionalField
- **Fix:** Cast `session.data.user` to `UserWithProfile` (already defined in auth-client.ts) in both components; used `unknown` intermediary in test mocks
- **Files modified:** SectionCards.tsx (linter auto-applied), RecentTransactionsWidget.tsx, balance-card.test.tsx, recent-transactions.test.tsx
- **Commit:** 74409fc

## Known Stubs

None — both components fetch live data via useSuspenseQuery. No placeholder values flow to UI.

## Threat Flags

No new threat surface introduced beyond what the plan's threat model covers. All data rendered as React text nodes (T-04-06 mitigation satisfied). Both components use Axios with withCredentials:true via the existing api instance (T-04-04 satisfied).

## Self-Check: PASSED

- frontend/src/features/dashboard/components/SectionCards.tsx — FOUND
- frontend/src/features/dashboard/components/RecentTransactionsWidget.tsx — FOUND
- frontend/src/__tests__/setup.ts — FOUND
- Commit 2b70728 — FOUND
- Commit 74409fc — FOUND
