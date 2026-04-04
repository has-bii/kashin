# Phase 02: Transaction Frontend - Research

**Researched:** 2026-04-04
**Domain:** Next.js 16 / React 19 feature module — transaction CRUD UI, server-side filtered list, nuqs URL state, CSV export
**Confidence:** HIGH

## Summary

The transaction frontend phase builds the user-facing transaction management screen inside the existing dashboard shell. The backend API is fully complete (Phase 1), so this phase is pure frontend work: a feature module scaffold, a mode-aware Sheet form, a custom server-side paginated list, filter bar with nuqs URL state, bulk-select, and CSV export.

All architectural decisions are locked in CONTEXT.md. The canonical pattern is the `category` feature module — every structural and library choice follows it directly. The only notable gap discovered is that no date-range picker component or `react-day-picker` / `date-fns` library is currently installed; the filter bar's date range input requires adding one before it can be implemented.

**Primary recommendation:** Follow the `frontend-feature` skill scaffold exactly. Use `nuqs` `parseAsIsoDate` (or `parseAsString`) for `dateFrom`/`dateTo` URL params. Add `react-day-picker` + `date-fns` for the date range picker (shadcn/ui Calendar component depends on them).

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Form Entry Point**
- D-01: Use a Sheet (side panel) for the transaction form — slides in from the right, keeps the list visible behind it. `sheet.tsx` already exists.
- D-02: Single Sheet component, mode-aware — accepts `mode="create"` or `mode="edit"`. Clicking a row opens the sheet in edit mode. A header button opens it in create mode.
- D-03: Delete action lives inside the edit sheet with an alert-dialog confirmation. No separate delete UI on the row.

**Transaction List Layout**
- D-04: Build a custom transaction list — do NOT reuse `data-table.tsx`. The existing component is wired for DnD + client-side pagination and is not the right fit for server-side pagination.
- D-05: Columns: Date, Amount, Category, Type, Note (note truncated if long).
- D-06: Pagination is server-side (confirmed by user). The backend already handles this.
- D-07: Row click opens the edit sheet. No hover actions, no 3-dot row menus.

**Filter UX**
- D-08: Top filter bar, always visible — persistent above the list, no collapsible panel. Contains: Type toggle (All / Expense / Income), Category dropdown, Date range picker, Search input.
- D-09: Default date range on page load: current month.
- D-10: Filters persist in the URL via nuqs (already in the stack). Shareable/bookmarkable filtered views.

**CSV Export**
- D-11: Export button in the page header, next to "Add Transaction".
- D-12: Exports the current filtered view — sends active filters to the backend and downloads the CSV. No export dialog, no field selection. WYSIWYG.

### Claude's Discretion
- Loading skeleton design for the list (use `skeleton.tsx`)
- Empty state copy and illustration (use `empty-state.tsx`)
- Exact page layout within the existing dashboard shell (sidebar + main-page components)
- Bulk-select checkbox placement and toolbar appearance

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TXN-01 | User can create a transaction with type, amount, date, category, and optional description/notes | Mode-aware Sheet form with TanStack React Form; `POST /transaction` API |
| TXN-02 | User can edit any of their own transactions | Same Sheet in `mode="edit"`; `PUT /transaction/:id` API |
| TXN-03 | User can delete a transaction | Alert-dialog inside edit Sheet; `DELETE /transaction/:id` API |
| TXN-04 | User can view their transaction list filtered by date range, type, and/or category | Custom list + nuqs URL params; `GET /transaction` with query params |
| TXN-05 | User can search transactions by description or notes text | Search input in filter bar; `search` query param on backend |
| TXN-06 | User can bulk-delete multiple selected transactions | Checkbox column + bulk toolbar; `POST /transaction/bulk-delete` API |
| EXPORT-01 | User can export transactions as a CSV file | Export button in header; send filters to backend, trigger file download |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TanStack React Query | ^5.96.1 | Server state, caching, list queries | Already installed + globally configured |
| TanStack React Form | ^1.28.6 | Form state management | Already installed — canonical form pattern |
| nuqs | ^2.8.9 | URL state for filters | Already installed + NuqsAdapter already in providers |
| Zod v4 | ^4.3.6 | Form schema validation | Already installed; import from `"zod/v4"` |
| Axios | ^1.14.0 | HTTP calls | Already installed via `@/lib/api` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-day-picker | ^8 or ^9 | Calendar / date range UI | Required for date range filter — not yet installed |
| date-fns | ^3 or ^4 | Date formatting and manipulation | Required peer dep of react-day-picker |
| sonner | ^2.0.7 | Toast feedback | Already installed — mutations use `toast.success/error` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-day-picker | flatpickr, react-datepicker | react-day-picker is what shadcn/ui Calendar component uses — use it |
| nuqs parseAs helpers | Manual URLSearchParams | nuqs is already in stack; manual parsing duplicates work |

**Installation (date picker — required before Plan 02-03):**
```bash
pnpm add react-day-picker date-fns
```

**Version verification:** Run `npm view react-day-picker version` before installing to confirm latest.

---

## Architecture Patterns

### Recommended Project Structure
```
frontend/src/features/transaction/
  types/index.ts                       — Transaction, PaginatedResponse interfaces
  validations/schema.ts                — Zod v4 create/update schemas + DTO types
  api/
    get-transactions.query.ts          — queryOptions for list (paginated + filtered)
    get-transaction.query.ts           — queryOptions for single item (edit prefetch)
  hooks/
    use-transaction-form.ts            — TanStack React Form (create/edit) + mutations
    use-transaction-filters.ts         — nuqs URL state for all filter params
    use-bulk-delete.ts                 — bulk-delete mutation + selected rows state
  components/
    TransactionSheet.tsx               — mode-aware Sheet wrapper
    TransactionForm.tsx                — form inside the sheet
    TransactionList.tsx                — custom server-side paginated table
    TransactionFilterBar.tsx           — always-visible filter row
    TransactionDeleteDialog.tsx        — alert-dialog inside edit sheet
    TransactionBulkToolbar.tsx         — floating toolbar when rows selected

frontend/src/app/dashboard/(main)/transactions/page.tsx
```

### Pattern 1: Query Options with Filters (server-side pagination)
**What:** Query key includes all filter params so React Query re-fetches when any filter changes.
**When to use:** All transaction list queries.
**Example:**
```typescript
// Source: canonical pattern from frontend/src/features/category/api/get-categories.query.ts
type GetTransactionsParams = {
  page: number
  limit: number
  type: "expense" | "income" | null
  categoryId: string | null
  dateFrom: string | null
  dateTo: string | null
  search: string | null
}

export const getTransactionsQueryKey = (params: GetTransactionsParams) => ["transactions", params]

export const getTransactionsQueryOptions = (params: GetTransactionsParams) =>
  queryOptions({
    queryKey: getTransactionsQueryKey(params),
    queryFn: () => getTransactions(params),
    // No staleTime/gcTime — set globally on QueryClient
  })
```

### Pattern 2: nuqs filter hook
**What:** Co-locate all URL param parsing in a single hook. One hook per feature.
**When to use:** Whenever filters drive server-side queries.
**Example:**
```typescript
// Source: frontend/src/features/category/hooks/use-get-category-filter.ts
import { parseAsString, parseAsStringEnum, parseAsInteger, useQueryStates } from "nuqs"

export const useTransactionFilters = () => {
  return useQueryStates({
    type: parseAsStringEnum(["expense", "income"]),
    categoryId: parseAsString,
    dateFrom: parseAsString,   // ISO date string: "2026-04-01"
    dateTo: parseAsString,     // ISO date string: "2026-04-30"
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
  })
}
```

### Pattern 3: Mode-aware Sheet
**What:** Single Sheet component controlled by parent state; mode prop drives title, default values, and which API endpoint to call.
**When to use:** Create + edit are structurally the same form, just different HTTP verbs.
**Example:**
```typescript
type Props =
  | { mode: "create"; open: boolean; onOpenChange: (v: boolean) => void }
  | { mode: "edit"; open: boolean; onOpenChange: (v: boolean) => void; data: Transaction }

export function TransactionSheet(props: Props) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{props.mode === "create" ? "Add Transaction" : "Edit Transaction"}</SheetTitle>
        </SheetHeader>
        <TransactionForm {...props} />
      </SheetContent>
    </Sheet>
  )
}
```

### Pattern 4: CSV export via Axios blob
**What:** Use Axios with `responseType: "blob"`, create object URL, trigger download programmatically.
**When to use:** File download triggered by button click.
**Example:**
```typescript
const exportCsv = async (filters: GetTransactionsParams) => {
  const { data } = await api.get("/transaction/export", {
    params: filters,
    responseType: "blob",
  })
  const url = URL.createObjectURL(data)
  const a = document.createElement("a")
  a.href = url
  a.download = "transactions.csv"
  a.click()
  URL.revokeObjectURL(url)
}
```

**Note:** The backend does not yet have a `/transaction/export` endpoint. Plan 02-01 must determine whether export runs backend-side (preferred, handles all data beyond current page) or is a client-side CSV build from the current query result. Given D-12 says "sends active filters to the backend," a backend export endpoint is required. The planner must schedule this backend addition.

### Pattern 5: Bulk-select with checkbox column
**What:** Controlled checkbox per row + header checkbox for select-all. Separate state from the query. Bulk toolbar appears when count > 0.
**When to use:** TXN-06 bulk-delete.

### Anti-Patterns to Avoid
- **Reusing `data-table.tsx`:** That component is DnD-wired with client-side pagination. D-04 explicitly forbids it.
- **Per-query staleTime/gcTime:** Already configured globally on QueryClient in `providers/index.tsx` — do not add to queryOptions.
- **React.memo / useMemo / useCallback:** React Compiler (babel-plugin-react-compiler) handles memoization automatically.
- **`import { z } from "zod"`:** Must be `import { z } from "zod/v4"` in this project.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL state sync | Manual URLSearchParams + router.push | nuqs `useQueryStates` | nuqs handles serialization, parsing, defaults, SSR-safe |
| Date range display | Custom date input | react-day-picker + shadcn Calendar | Accessibility, keyboard nav, range selection edge cases |
| Form validation | Custom field validation | TanStack React Form + Zod | Already in stack; consistent with category pattern |
| Optimistic UI | Manual cache editing | `queryClient.invalidateQueries` | Sufficient for this app; simpler to reason about |
| CSV download | Server-rendered file | Axios blob + object URL | No new route required if backend endpoint is added |

**Key insight:** Every hard problem in this phase (state, forms, filtering, caching) already has an installed, configured solution. The task is wiring them together, not building primitives.

---

## Common Pitfalls

### Pitfall 1: Backend export endpoint missing
**What goes wrong:** Plan assumes `GET /transaction/export` exists — it does not. Phase 1 only built CRUD endpoints.
**Why it happens:** D-12 describes frontend behavior but the backend counterpart was not in Phase 1 scope.
**How to avoid:** Plan 02-01 or 02-04 must include a backend task to add `GET /transaction/export` that accepts the same query params as `GET /transaction` and returns `text/csv`.
**Warning signs:** If Plan 02-04 only touches frontend files, the export will fail at runtime.

### Pitfall 2: Filter default date range not in URL on first load
**What goes wrong:** D-09 says default date range is current month, but nuqs initializes params as `null` if absent from URL. The list query sends `null` to the backend and returns all-time data.
**Why it happens:** nuqs does not write defaults to the URL on mount by default.
**How to avoid:** Derive the current month's start/end in the filter hook and fall back to those values when URL params are null. The query function uses the resolved value (not raw null). Alternatively use `nuqs` `withDefault()` with a dynamic date — but dynamic defaults require computing them outside the `parseAs*` call.

### Pitfall 3: Sheet open state leaks between create and edit
**What goes wrong:** Clicking a row, closing the sheet, then clicking "Add" pre-fills edit data.
**Why it happens:** Parent state holds `selectedTransaction` and resets it lazily.
**How to avoid:** Reset `selectedTransaction` to `null` in the `onOpenChange` handler when sheet closes. Mode is derived from whether `selectedTransaction` is null.

### Pitfall 4: Decimal amount display / precision
**What goes wrong:** Amount stored as `DECIMAL(12,2)` in PostgreSQL comes back as a string from Prisma. Displaying or summing it without parsing produces `"10.00" + "5.00" = "10.005.00"`.
**Why it happens:** Prisma serializes Decimal fields as strings in JSON.
**How to avoid:** Parse with `parseFloat()` or `Number()` before arithmetic. For display use `Intl.NumberFormat` (already the project convention per REQUIREMENTS.md "Single-currency display").

### Pitfall 5: `data-table.tsx` temptation
**What goes wrong:** Reaching for `data-table.tsx` because it already has columns and sorting.
**Why it happens:** DRY instinct.
**How to avoid:** D-04 is a hard constraint. Build a bespoke `<table>` or plain div list. The transaction list does not need DnD or client-side sort.

### Pitfall 6: nuqs NuqsAdapter already in providers
**What goes wrong:** Adding a second `NuqsAdapter` in the transactions page.
**Why it happens:** Developer adds adapter assuming it's missing.
**How to avoid:** `NuqsAdapter` is already wrapped at root in `frontend/src/providers/index.tsx`. Do not add another one.

---

## Code Examples

### nuqs filter hook (multiple params)
```typescript
// Source: nuqs docs pattern + existing use-get-category-filter.ts
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

export const useTransactionFilters = () => {
  const [filters, setFilters] = useQueryStates({
    type: parseAsStringEnum(["expense", "income"]),
    categoryId: parseAsString,
    dateFrom: parseAsString,
    dateTo: parseAsString,
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
  })
  return { filters, setFilters }
}
```

### TanStack React Form with mode-aware defaults
```typescript
// Source: frontend/src/features/category/hooks/use-category-form.ts (adapted)
const form = useForm({
  defaultValues: {
    type: (prevData?.type ?? "expense") as TransactionType,
    amount: prevData?.amount ? String(prevData.amount) : "",
    transactionDate: prevData?.transactionDate ?? new Date().toISOString().split("T")[0],
    categoryId: prevData?.categoryId ?? null,
    description: prevData?.description ?? "",
    notes: prevData?.notes ?? "",
  },
  validators: { onSubmit: transactionFormSchema },
  onSubmit: async ({ value }) => await mutation.mutateAsync(value, { onSuccess: args.onSuccess }),
})
```

### Invalidate transactions query after mutation
```typescript
// Source: frontend/src/features/category/hooks/use-category-form.ts (pattern)
queryClient.invalidateQueries({ queryKey: ["transactions"] })
```

### Page structure (follows category page pattern)
```typescript
// Source: frontend/src/app/dashboard/(main)/category/page.tsx
export default function TransactionsPage() {
  return (
    <>
      <SiteHeader label="Transactions" />
      <MainPage>
        <MainPageHeader>
          <MainPageTitle>Transactions</MainPageTitle>
          {/* Export button + Add Transaction button */}
        </MainPageHeader>
        <Suspense>
          <TransactionFilterBar />
        </Suspense>
        <TransactionList />
      </MainPage>
    </>
  )
}
```

---

## Environment Availability

Step 2.6: Checked. This phase is frontend code changes with one backend addition (export endpoint). All required runtimes are already in use.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / pnpm | Frontend dev server | ✓ | pnpm in use | — |
| Bun | Backend export endpoint | ✓ | in use | — |
| PostgreSQL | Backend data | ✓ | running (Phase 1 complete) | — |
| react-day-picker | Date range filter | ✗ | not installed | Input[type=date] (2 fields) as fallback |
| date-fns | Peer dep of react-day-picker | ✗ | not installed | — |

**Missing dependencies with no fallback:**
- None blocking critical features.

**Missing dependencies with fallback:**
- `react-day-picker` + `date-fns` — required for date range picker UI. Fallback: two `<Input type="date">` fields (simple but functional). Prefer adding the library for UX consistency.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Not yet configured (noted in CLAUDE.md: "Not yet configured (framework ready for Jest/Vitest)") |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TXN-01 | Create transaction form submits to API | manual-only | — | — |
| TXN-02 | Edit transaction updates existing record | manual-only | — | — |
| TXN-03 | Delete with confirmation removes record | manual-only | — | — |
| TXN-04 | Filter bar changes reflect in list | manual-only | — | — |
| TXN-05 | Search input filters results by text | manual-only | — | — |
| TXN-06 | Bulk-delete removes selected rows | manual-only | — | — |
| EXPORT-01 | Export downloads CSV for filtered view | manual-only | — | — |

No automated test infrastructure exists. All verification is manual smoke testing against the running dev server.

### Wave 0 Gaps
- No test framework installed. All verification is manual.
- Recommend: verify each success criterion manually per `/gsd:verify-work` checklist.

---

## Integration Points Summary

| What | Where | Notes |
|------|-------|-------|
| New route | `frontend/src/app/dashboard/(main)/transactions/page.tsx` | Inside existing `(main)` layout |
| Sidebar entry | `frontend/src/components/sidebar/app-sidebar.tsx` | Add `{ title: "Transactions", url: "/dashboard/transactions", icon: <ReceiptIcon /> }` to `navMain` |
| Backend APIs | `GET /transaction`, `POST /transaction`, `PUT /transaction/:id`, `DELETE /transaction/:id`, `POST /transaction/bulk-delete` | All exist from Phase 1 |
| Export endpoint | `GET /transaction/export` | **Does NOT exist** — must be added in this phase |
| Auth | Cookies sent automatically via `withCredentials: true` | No changes needed |
| Categories for dropdown | `GET /category` | Already exists; use `getCategoriesQueryOptions` |

---

## Open Questions

1. **Export endpoint implementation**
   - What we know: D-12 says "sends active filters to the backend." No such endpoint exists.
   - What's unclear: Should Plan 02-04 include a backend task, or is a client-side CSV build (from query result) acceptable for v1?
   - Recommendation: Add `GET /transaction/export` to the backend as a simple CSV serializer using the same `where` logic as `getAll`. This keeps "export current filtered view" true even when total > page size. Plan 02-04 should include one backend task.

2. **Date range picker library**
   - What we know: No date picker installed. `react-day-picker` is what shadcn/ui Calendar is built on.
   - What's unclear: Whether to use shadcn's `calendar` command (`npx shadcn add calendar`) or install directly.
   - Recommendation: Use `pnpm dlx shadcn add calendar` — this installs `react-day-picker` + `date-fns` and generates `calendar.tsx` in `components/ui/`. Then compose a `DateRangePicker` component using `Sheet`/`Popover` + `Calendar`. Plan 02-03 should include this as a Wave 0 setup step.

3. **Decimal amount in form**
   - What we know: Backend accepts amount as a number; Prisma stores `DECIMAL(12,2)`.
   - What's unclear: Whether the API returns amount as string or number in JSON.
   - Recommendation: Treat as string in the form, parse to number before submitting. Validate with `z.coerce.number().positive()` in the Zod schema.

---

## Sources

### Primary (HIGH confidence)
- Direct file reads: `backend/src/modules/transaction/index.ts`, `service.ts`, `query.ts` — confirmed all API routes, query params, response shapes
- Direct file reads: `frontend/src/features/category/` — confirmed canonical patterns (queryOptions, form hook, form component)
- Direct file reads: `frontend/src/providers/index.tsx` — confirmed NuqsAdapter and QueryClient global config
- Direct file reads: `frontend/src/components/sidebar/app-sidebar.tsx` — confirmed sidebar structure
- Direct file reads: `frontend/src/features/category/hooks/use-get-category-filter.ts` — confirmed nuqs usage pattern
- Direct file reads: `frontend/package.json` — confirmed installed deps, confirmed no date picker installed

### Secondary (MEDIUM confidence)
- `.claude/skills/frontend-feature.md` — feature module structure, rules, checklist

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all installed libraries confirmed from package.json
- Architecture: HIGH — canonical patterns read directly from source
- Pitfalls: HIGH for code issues; MEDIUM for export endpoint (implementation not yet decided)
- Missing dependencies: HIGH — confirmed absence of react-day-picker/date-fns from package.json

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable stack)

## Project Constraints (from CLAUDE.md)

Directives the planner must verify all tasks comply with:

| Directive | Rule |
|-----------|------|
| Package manager | pnpm for frontend (`pnpm add`, never `npm install`) |
| Zod import | `import { z } from "zod/v4"` — not `"zod"` |
| No manual memo | Never use React.memo / useMemo / useCallback — React Compiler handles it |
| No staleTime/gcTime on queries | Set globally on QueryClient; do not add per-query |
| data-table.tsx | Do NOT reuse for transactions (D-04) |
| ID format | UUID v7 for user-facing records (no change needed, backend handles) |
| Prettier | No semicolons, double quotes, 100 char width |
| Error classes | `NotFoundError` (404), `Conflict` (409) — only relevant for backend export endpoint |
| Auth | All backend routes use `{ auth: true }` macro |
| Service pattern | Static methods, `userId` as first arg |
