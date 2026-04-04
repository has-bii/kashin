# Phase 2: Transaction Frontend - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Transaction CRUD UI — create/edit form, list with filters/search/pagination, bulk-delete, and CSV export. This phase delivers the user-facing transaction management screen. Dashboard widgets and charts are not in scope (Phase 3–4).

</domain>

<decisions>
## Implementation Decisions

### Form Entry Point
- **D-01:** Use a **Sheet (side panel)** for the transaction form — slides in from the right, keeps the list visible behind it. `sheet.tsx` already exists.
- **D-02:** Single Sheet component, **mode-aware** — accepts `mode="create"` or `mode="edit"`. Clicking a row opens the sheet in edit mode. A header button opens it in create mode.
- **D-03:** Delete action lives **inside the edit sheet** with an alert-dialog confirmation. No separate delete UI on the row.

### Transaction List Layout
- **D-04:** Build a **custom transaction list** — do NOT reuse `data-table.tsx`. The existing component is wired for DnD + client-side pagination and is not the right fit for server-side pagination.
- **D-05:** Columns: **Date, Amount, Category, Type, Note** (note truncated if long).
- **D-06:** Pagination is **server-side** (confirmed by user). The backend already handles this.
- **D-07:** Row click opens the edit sheet. No hover actions, no 3-dot row menus.

### Filter UX
- **D-08:** **Top filter bar, always visible** — persistent above the list, no collapsible panel. Contains: Type toggle (All / Expense / Income), Category dropdown, Date range picker, Search input.
- **D-09:** Default date range on page load: **current month**.
- **D-10:** Filters persist in the **URL via nuqs** (already in the stack). Shareable/bookmarkable filtered views.

### CSV Export
- **D-11:** Export button in the **page header**, next to "Add Transaction".
- **D-12:** Exports the **current filtered view** — sends active filters to the backend and downloads the CSV. No export dialog, no field selection. WYSIWYG.

### Claude's Discretion
- Loading skeleton design for the list (use `skeleton.tsx`)
- Empty state copy and illustration (use `empty-state.tsx`)
- Exact page layout within the existing dashboard shell (sidebar + main-page components)
- Bulk-select checkbox placement and toolbar appearance

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Key source files to reference
- `frontend/src/features/category/` — canonical pattern for a feature module (api/, components/, hooks/, validations/, types/)
- `frontend/src/app/dashboard/(main)/category/page.tsx` — canonical page structure (SiteHeader, MainPage, dynamic import with Suspense)
- `frontend/src/components/responsive-dialog.tsx` — understand the dialog/sheet pattern even though transaction uses Sheet directly
- `frontend/src/features/category/components/category-form.tsx` — canonical form structure with TanStack React Form
- `frontend/src/features/category/api/get-categories.query.ts` — canonical queryOptions pattern
- `backend/src/modules/transaction/index.ts` — transaction API routes and query params (what the frontend must call)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sheet.tsx` — side panel component for the transaction form
- `select-tab.tsx` — type toggle (expense / income / all), already used in CategoryForm
- `alert-dialog.tsx` — delete confirmation dialog inside the edit sheet
- `empty-state.tsx` — empty state when no transactions match filters
- `skeleton.tsx` — loading state for the list
- `badge.tsx` — type and category labels in list rows
- `responsive-dialog.tsx` — understand its API even though Sheet is preferred for transactions

### Established Patterns
- nuqs: URL state management for filter params (type, categoryId, dateFrom, dateTo, search, page)
- TanStack Query: `queryOptions()` factory for all data fetching, global `staleTime`/`gcTime` set — don't add per-query
- TanStack React Form: all form state management — see CategoryForm for the pattern
- Feature module structure: `api/`, `components/`, `hooks/`, `validations/`, `types/` directories
- Service methods take `userId` first — frontend always gets data scoped to the session user automatically via cookies

### Integration Points
- New route: `/dashboard/transactions` — inside the existing `(main)` layout group
- Sidebar navigation: add Transactions entry to the existing sidebar (check `frontend/src/components/sidebar/`)
- Backend API: `GET /transaction`, `POST /transaction`, `PATCH /transaction/:id`, `DELETE /transaction/:id`, `DELETE /transaction/bulk`
- Auth: cookies sent automatically via `withCredentials: true` in `src/lib/api.ts`

### What NOT to reuse
- `data-table.tsx` — DnD + client-side pagination, not appropriate for server-side pagination

</code_context>

<specifics>
## Specific Ideas

- Sheet form with list visible behind it (user confirmed this visual layout explicitly)
- Filter bar always visible — no collapsible/hidden filters
- CSV export is WYSIWYG: current filtered view downloads, no dialog

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-transaction-frontend*
*Context gathered: 2026-04-04*
