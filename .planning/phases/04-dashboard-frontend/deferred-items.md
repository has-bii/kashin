# Deferred Items — Phase 04 Dashboard Frontend

## Out-of-scope issues discovered during 04-03 execution

### TSC errors in Plan 02 test files

**Files:**
- `frontend/src/__tests__/dashboard/balance-card.test.tsx` (lines 34, 39, etc.)
- `frontend/src/__tests__/dashboard/recent-transactions.test.tsx` (lines 31, 41, 50, 78)

**Issues:**
1. `authClient.useSession()` mock uses `{ data: { user: { currency: string } } }` — missing `isPending`, `isRefetching`, `error`, `refetch` properties required by BetterAuth type. Fix: use `as unknown as ReturnType<typeof authClient.useSession>` cast.
2. `TransactionType` enum values in test data use uppercase `"EXPENSE"`, `"INCOME"` but the type requires lowercase `"expense"`, `"income"`.

**Disposition:** Fix in a follow-up pass on Plan 02 test files. These do not affect runtime behavior — only test compilation.
