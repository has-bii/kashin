# Requirements: Kashin

**Defined:** 2026-04-04
**Core Value:** A fast, frictionless way to log and visualize personal finances — before any AI automation, subscriptions, or mobile features exist.

## Already Validated

These are shipped and working — not in the roadmap.

- ✓ User authentication (email/password + Google OAuth + email OTP) — existing
- ✓ Category management (CRUD: name, type, icon, color) — existing
- ✓ Settings (profile management + authentication settings) — existing
- ✓ Database schema (Transaction, EmailInbox, EmailLog, AiExtraction, RecurringTransaction) — existing
- ✓ Dashboard UI shell (layout, sidebar, placeholder components) — existing

## v1 Requirements

Requirements for Milestone 1. Each maps to a roadmap phase.

### Transaction Management

- [x] **TXN-01**: User can create a transaction with type (expense/income), amount, date, category, and optional description/notes
- [x] **TXN-02**: User can edit any of their own transactions
- [x] **TXN-03**: User can delete a transaction
- [x] **TXN-04**: User can view their transaction list filtered by date range, type, and/or category
- [x] **TXN-05**: User can search transactions by description or notes text
- [x] **TXN-06**: User can bulk-delete multiple selected transactions

### Dashboard

- [ ] **DASH-01**: User can see spending breakdown by category as a chart (connected to real transaction data)
- [ ] **DASH-02**: User can see income vs expenses balance overview for a date range
- [ ] **DASH-03**: User can see monthly spending trends chart
- [ ] **DASH-04**: User can see a recent transactions widget on the dashboard

### Data Export

- [ ] **EXPORT-01**: User can export their transactions as a CSV file

## v2 Requirements

Deferred to Milestone 2. Not in current roadmap.

### AI Email Extraction

- **EMAIL-01**: User has a dedicated email address to forward receipts/invoices to
- **EMAIL-02**: AI extracts vendor, amount, date, and suggests a category from forwarded email
- **EMAIL-03**: User sees a pending review queue for AI-extracted entries (in-app alert/badge)
- **EMAIL-04**: User can confirm or edit an AI-extracted entry before it is saved as a transaction
- **EMAIL-05**: AI suggests a category name; user maps it to one of their own categories

### Subscriptions

- **SUBS-01**: User can subscribe to a paid plan (Stripe)
- **SUBS-02**: Free tier with usage limits
- **SUBS-03**: Billing management (upgrade, cancel, view invoices)

### Recurring Transactions

- **RECUR-01**: User can define a recurring transaction (frequency, amount, category)
- **RECUR-02**: Recurring transactions are automatically generated on schedule

## Out of Scope

| Feature | Reason |
|---------|--------|
| Team / multi-tenant workspaces | Personal use only — one user per account |
| Bank sync (Plaid, etc.) | High complexity, not core to v1 value |
| Budget goals / alerts | Useful but not table stakes for v1 |
| Mobile app | Web-first; mobile after web app ships |
| Browser/native push notifications | In-app badge sufficient for now; native push deferred to mobile |
| Multi-currency arithmetic | Single-currency display (Intl.NumberFormat); Dinero.js deferred to v2+ |
| Receipt/attachment uploads | Deferred to v2 (email flow handles attachments) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TXN-01 | Phase 1 | Complete |
| TXN-02 | Phase 1 | Complete |
| TXN-03 | Phase 1 | Complete |
| TXN-04 | Phase 1 | Complete |
| TXN-05 | Phase 1 | Complete |
| TXN-06 | Phase 1 | Complete |
| DASH-01 | Phase 3 + Phase 4 | Pending |
| DASH-02 | Phase 3 + Phase 4 | Pending |
| DASH-03 | Phase 3 + Phase 4 | Pending |
| DASH-04 | Phase 3 + Phase 4 | Pending |
| EXPORT-01 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-04*
*Last updated: 2026-04-04 — traceability populated after roadmap creation*
