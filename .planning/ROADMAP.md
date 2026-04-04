# Roadmap: Kashin — Milestone 1 (Transaction Core + Dashboard)

## Overview

From working auth and categories to a fully functional personal finance tracker. Four phases follow the backend-first pattern established by existing modules: transaction CRUD API, then its frontend, then dashboard aggregation API, then dashboard UI connected to real data. Every requirement maps cleanly to one of these four delivery boundaries.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Transaction Backend** - CRUD API with server-side filtering, pagination, and v2-ready schema
- [ ] **Phase 2: Transaction Frontend** - Form, list, filters, bulk actions, and CSV export
- [ ] **Phase 3: Dashboard Backend** - Read-only aggregation endpoints for summary, trends, and category breakdown
- [ ] **Phase 4: Dashboard Frontend** - Connect existing dashboard shell to real data with charts and widgets

## Phase Details

### Phase 1: Transaction Backend
**Goal**: Users' transactions can be created, read, updated, and deleted through a fully guarded API
**Depends on**: Nothing (builds on existing auth + category modules)
**Requirements**: TXN-01, TXN-02, TXN-03, TXN-04, TXN-05, TXN-06
**Success Criteria** (what must be TRUE):
  1. User can create a transaction (expense or income) with type, amount, date, category, and optional description/vendor via POST endpoint
  2. User can retrieve their transaction list filtered by date range, type, and/or category with server-side pagination
  3. User can search transactions by description or notes text via query param
  4. User can edit or delete any of their own transactions; attempts to touch another user's transactions return 404
  5. User can bulk-delete a list of selected transaction IDs in one request
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Query schemas + TransactionService with full CRUD, pagination, search, and bulk-delete
- [ ] 01-02-PLAN.md — Transaction controller routes + mount in app entry point

### Phase 2: Transaction Frontend
**Goal**: Users can manage their transactions through the UI — creating, editing, deleting, filtering, and exporting
**Depends on**: Phase 1
**Requirements**: TXN-01, TXN-02, TXN-03, TXN-04, TXN-05, TXN-06, EXPORT-01
**Success Criteria** (what must be TRUE):
  1. User can open a form, fill in transaction fields, and save a new transaction that appears in the list
  2. User can click a transaction to edit any field and see the updated record immediately
  3. User can delete a single transaction after a confirmation prompt
  4. User can filter the transaction list by date range, type, and category; filters persist in the URL
  5. User can select multiple transactions and bulk-delete them
  6. User can export their transaction list as a CSV file that downloads to their device
**Plans**: TBD

Plans:
- [ ] 02-01: Transaction feature module scaffold + TanStack Query options (list, create, update, delete)
- [ ] 02-02: TransactionForm (create/edit) + delete confirm dialog
- [ ] 02-03: TransactionList with filters (nuqs URL state), search, pagination
- [ ] 02-04: Bulk-select UI + bulk-delete action + CSV export
**UI hint**: yes

### Phase 3: Dashboard Backend
**Goal**: Aggregated financial data is available via dedicated read-only endpoints, separated from the transaction CRUD module
**Depends on**: Phase 1
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04
**Success Criteria** (what must be TRUE):
  1. A summary endpoint returns total income, total expenses, and net balance for a requested date range
  2. A category breakdown endpoint returns spend totals grouped by category for a date range
  3. A monthly trends endpoint returns income and expense totals for each of the trailing N months
  4. A recent transactions endpoint returns the last N confirmed transactions for the dashboard widget
**Plans**: TBD

Plans:
- [ ] 03-01: Dashboard module scaffold + DashboardService skeleton
- [ ] 03-02: Summary + recent transactions endpoints
- [ ] 03-03: Category breakdown + monthly trends endpoints

### Phase 4: Dashboard Frontend
**Goal**: The dashboard displays real financial data through charts and widgets, replacing all mock data
**Depends on**: Phase 3
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04
**Success Criteria** (what must be TRUE):
  1. User can see income vs. expenses balance summary for the current month on the dashboard
  2. User can see a donut/pie chart showing spending broken down by category
  3. User can see a bar chart of monthly spending trends over the trailing 6 months
  4. User can see a recent transactions widget listing their last 10 transactions on the dashboard
**Plans**: TBD

Plans:
- [ ] 04-01: Dashboard TanStack Query options + replace mock data wiring
- [ ] 04-02: BalanceCard + RecentTransactions widget connected to real data
- [ ] 04-03: CategoryChart (donut) + MonthlyChart (bar) with shadcn chart primitives + Suspense skeletons
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Transaction Backend | 0/2 | Not started | - |
| 2. Transaction Frontend | 0/4 | Not started | - |
| 3. Dashboard Backend | 0/3 | Not started | - |
| 4. Dashboard Frontend | 0/3 | Not started | - |
