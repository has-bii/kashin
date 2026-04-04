---
phase: 02-transaction-frontend
plan: 04
subsystem: ui+backend
tags: [typescript, bulk-delete, csv-export, better-auth, currency]

requires:
  - plan: 02-03
    provides: TransactionList, TransactionFilterBar, pagination, page wiring

provides:
  - CSV export endpoint GET /api/transaction/export returning text/csv
  - Frontend exportTransactionsCsv() with Axios blob download
  - useBulkDelete hook with checkbox selection state + bulk delete mutation
  - TransactionBulkToolbar with AlertDialog confirmation
  - Checkbox column in TransactionList (header + per-row, select-all on page)
  - Export button in transactions page header wired to active filters
  - User currency from Better Auth additionalFields exposed in session
  - Transaction amounts formatted with user's currency code (Intl.NumberFormat)
  - Amount field label in TransactionForm shows user's currency code

affects: []

tech-stack:
  added: []
  patterns:
    - "CSV export via Axios blob + object URL anchor click pattern"
    - "Bulk selection via Set<string> state managed in custom hook"
    - "Better Auth additionalFields for exposing custom user columns in session"
    - "Currency-aware Intl.NumberFormat using session user.currency"
    - "AlertDialogAction variant='destructive' for confirm-delete actions"

key-files:
  created:
    - backend/src/modules/transaction/service.ts (exportAll method added)
    - backend/src/modules/transaction/index.ts (GET /export route added)
    - frontend/src/features/transaction/hooks/use-bulk-delete.ts
    - frontend/src/features/transaction/components/TransactionBulkToolbar.tsx
    - frontend/src/features/transaction/api/export-transactions.ts
  modified:
    - frontend/src/features/transaction/components/TransactionList.tsx
    - frontend/src/app/dashboard/(main)/transactions/page.tsx
    - backend/src/lib/auth.ts
    - frontend/src/lib/auth-client.ts
    - frontend/src/features/transaction/components/TransactionForm.tsx
    - frontend/src/features/transaction/components/TransactionDeleteDialog.tsx
    - frontend/src/features/transaction/components/TransactionBulkToolbar.tsx

decisions:
  - "Read user currency from authClient.useSession() directly in list/form components — avoids prop drilling"
  - "Cast session.user to include currency field via intersection type until Better Auth infers it automatically"
  - "AlertDialogAction accepts variant prop (shadcn wrapper) — prefer variant='destructive' over inline className"

metrics:
  duration: "~2 hours"
  completed: "2026-04-04"
  tasks_completed: 4
  files_modified: 10
---

# Phase 02 Plan 04: Bulk Select, CSV Export, Currency Display Summary

**One-liner:** Bulk delete with checkbox selection, CSV export with filter awareness, and user currency-aware amount formatting across the transaction UI.

## What Was Built

**Task 1 — Backend CSV export endpoint**
- Added `TransactionService.exportAll()` static method — reuses same `where` filter as `getAll` but fetches all records (no pagination)
- Builds CSV with headers: `Date,Type,Amount,Currency,Category,Description,Notes`
- Added `GET /export` route in transaction controller before parameterized routes — returns `text/csv` with `Content-Disposition: attachment` header
- Commit: `7cb4b22`

**Task 2 — Frontend bulk-select, bulk-delete, CSV export, page wiring**
- `use-bulk-delete.ts`: `Set<string>` selection state, `toggleId/toggleAll/clearSelection/deleteSelected`, mutation calling `POST /transaction/bulk-delete`, query invalidation on success
- `TransactionBulkToolbar.tsx`: floating bar when selections exist, AlertDialog confirmation before bulk delete
- `export-transactions.ts`: Axios blob request + anchor download pattern, passes active filter params
- `TransactionList.tsx`: checkbox column added with header select-all and per-row checkboxes, `stopPropagation` prevents row click conflict
- `transactions/page.tsx`: Export button in header wired to current filters, bulk toolbar conditional render
- Commit: `ef88084`

**Post-checkpoint fixes (after user review)**
- `backend/src/lib/auth.ts`: Added `user.additionalFields` for `currency` and `timezone` so they are exposed in Better Auth session responses
- `auth-client.ts`: Exported `UserWithProfile` type for typed access to additional fields
- `TransactionList.tsx`: `formatAmount` now accepts currency param read from `authClient.useSession()`
- `TransactionForm.tsx`: Amount label shows `Amount (IDR)` reflecting user's currency
- `TransactionDeleteDialog.tsx` + `TransactionBulkToolbar.tsx`: `AlertDialogAction` now uses `variant="destructive"` instead of inline className
- Commits: `c1b7afb`, `64605c7`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] Currency hardcoded as USD in formatAmount**
- **Found during:** Post-checkpoint review (Task 2 verification)
- **Issue:** `formatAmount` in `TransactionList.tsx` hardcoded `currency: "USD"` — user's currency field existed in DB but was not exposed via session
- **Fix:** Added `additionalFields` to Better Auth config so `currency` and `timezone` are included in session user; read via `authClient.useSession()` in list and form components
- **Files modified:** `backend/src/lib/auth.ts`, `frontend/src/lib/auth-client.ts`, `TransactionList.tsx`, `TransactionForm.tsx`
- **Commits:** `c1b7afb`

**2. [Rule 1 - Bug] Destructive confirm buttons missing proper variant**
- **Found during:** Post-checkpoint review
- **Issue:** `AlertDialogAction` in `TransactionDeleteDialog` and `TransactionBulkToolbar` did not pass `variant="destructive"` — the shadcn `AlertDialogAction` wrapper accepts and forwards `variant` to the underlying `Button`
- **Fix:** Added `variant="destructive"` prop; removed redundant inline className in `TransactionBulkToolbar`
- **Files modified:** `TransactionDeleteDialog.tsx`, `TransactionBulkToolbar.tsx`
- **Commit:** `64605c7`

## Commits

| Hash | Message |
|------|---------|
| `7cb4b22` | feat(02-04): add CSV export endpoint to transaction module |
| `ef88084` | feat(02-04): add bulk-select, bulk-delete, CSV export frontend |
| `c1b7afb` | fix(02-04): expose user currency via Better Auth additionalFields and use in transaction display |
| `64605c7` | fix(02-04): use destructive variant on AlertDialogAction confirm buttons |

## Known Stubs

None — all data is wired from real API and session.

## Self-Check: PASSED

- `backend/src/lib/auth.ts` — exists with additionalFields
- `frontend/src/features/transaction/hooks/use-bulk-delete.ts` — exists
- `frontend/src/features/transaction/components/TransactionBulkToolbar.tsx` — exists
- `frontend/src/features/transaction/api/export-transactions.ts` — exists
- All 4 commits confirmed in git log
- TypeScript: `npx tsc --noEmit` passes with 0 errors
