# Feature Landscape

**Domain:** Personal expense/income tracker (manual entry, v1)
**Researched:** 2026-04-04
**Scope:** Transaction management + dashboard/reporting for Milestone 1

---

## Table Stakes

Features users expect from any expense tracker. Missing = product feels broken or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Create transaction (type, amount, date, category, note) | Core loop — no other feature works without this | Low | Type = expense/income. Note/vendor optional but expected. |
| Edit transaction | Data entry mistakes are universal | Low | Same form as create |
| Delete transaction | Users make errors, change their minds | Low | Soft confirm before delete |
| Transaction list view | Must see what you've entered | Low | Paginated or infinite scroll |
| Filter by date range | Month-by-month review is the primary mental model | Medium | Default = current month. Presets: this month, last month, this year |
| Filter by category | Find "how much did I spend on food?" instantly | Low | Multi-select |
| Filter by type (expense/income) | Separate review of income vs outflow | Low | Toggle or dropdown |
| Search transactions | Find a specific vendor or note quickly | Medium | Client-side for small datasets; debounced for large |
| Income vs. expenses balance summary | Net position at a glance | Low | Single number: income - expenses for selected period |
| Category spending breakdown (chart) | "Where did my money go?" is THE core question | Medium | Pie or donut chart by category, for selected period |
| Monthly spending trend (chart) | See patterns over time | Medium | Bar or line chart, 6–12 months of bars |
| Recent transactions list on dashboard | Quick sanity check without navigating away | Low | Last 5–10 entries, linkable to full list |
| Amount always stored with currency precision | Floating point errors erode trust immediately | Low | Store as integer cents (or Decimal in Prisma) — never float |

---

## Differentiators

Features that aren't universally expected but create real competitive advantage for Kashin's roadmap.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Vendor/merchant field on transactions | Enables richer search ("how much at Uber this month?") | Low | Optional text field; also primes v2 AI extraction |
| v2-ready data model (source, pending, raw_ai_data columns) | Zero-migration path when AI email drops | Low | Add nullable columns now: `source` enum (manual/email), `pendingReview` bool, `rawAiPayload` JSON |
| Inline edit from transaction list | Faster workflow than navigating to a detail page | Medium | Avoid full-page navigation for single-field corrections |
| "This month at a glance" hero summary | Answers the dashboard's primary question in one row | Low | Total income / total expenses / net, current period |
| Sorting on transaction list | Date DESC is fine as default, but amount sort surfaces big spends | Low | Sort by date, amount, category |

---

## Anti-Features

Explicitly defer these in v1. Building them now wastes cycles and introduces scope creep.

| Anti-Feature | Why Avoid in v1 | What to Do Instead |
|--------------|----------------|-------------------|
| Bank account sync (Plaid, etc.) | Massive auth/compliance surface, ongoing maintenance, not core to manual-entry positioning | Manual entry only; v2 email intake is the automation story |
| Budget goals and alerts | Adds a separate data model and notification infrastructure | Track actuals only; alerts deferred to post-v2 |
| Recurring transaction rules | Complex state machine, edge cases with months of different length | Users re-enter recurring items; v2 email covers most receipts |
| Multi-currency support | Exchange rate API dependency, display complexity | Single currency per account; add later if users request |
| CSV/spreadsheet import | Parsing edge cases, mapping UI, error handling — high effort | Manual entry is the v1 contract; bulk import is post-v3 |
| Investment / net worth tracking | Different domain (Monarch, Copilot territory); dilutes the expense tracker focus | Out of scope entirely for personal tracker |
| Shared/household accounts | Multi-user data model changes everything | Personal use only; PROJECT.md already calls this out |
| Push notifications | Requires native app or web push infra | In-app only; defer to mobile |
| Receipt photo upload/OCR | OCR accuracy is poor without ML pipeline; v2 email AI is the better path | v2 handles this via email forwarding |
| Tags / custom fields | Adds UI complexity before users have validated base workflow | Categories cover 90% of use cases |
| Reports export (PDF/CSV) | Non-trivial to do well; low v1 priority | Add if users ask post-launch |

---

## Feature Dependencies

```
Auth (done) → all transaction features (userId FK on every row)
Category (done) → transaction create/edit (category selector)
Transaction CRUD → dashboard charts (no data = no charts)
Transaction list + filters → dashboard recent list (same underlying query)
Date range filter → monthly trend chart (period parameterization)
```

---

## MVP Recommendation

Prioritize these in order for Milestone 1:

1. **Transaction CRUD** — create/edit/delete with type, amount, date, category, optional note/vendor
2. **Transaction list** — paginated, sortable by date DESC, filters for date range / category / type
3. **Dashboard summary row** — income total / expense total / net for current month
4. **Category breakdown chart** — donut/pie for current period (uses same data as list)
5. **Monthly trend chart** — bar chart over trailing 6 months
6. **Recent transactions widget** — last 10 entries on dashboard

Defer from v1:
- Search (add after core list ships; lower urgency)
- Inline edit (nice-to-have, not blocking)
- v2-ready columns (add to schema now as nullable — zero UI cost)

---

## Sources

- [Best budgeting apps 2026 — Engadget](https://www.engadget.com/apps/best-budgeting-apps-120036303.html) — MEDIUM confidence (review article)
- [Monarch Money feature overview](https://www.monarch.com/) — MEDIUM confidence (marketing page)
- [Copilot Money](https://www.copilot.money/) — MEDIUM confidence (marketing page)
- [YNAB vs Monarch comparison](https://www.ynab.com/blog/ynab-vs-monarch) — MEDIUM confidence (biased source, cross-referenced)
- [Personal expense tracker apps 2026 — Expensify](https://use.expensify.com/blog/personal-expense-tracker-apps) — MEDIUM confidence (competitor, but accurate feature listing)
- PROJECT.md requirements and Out of Scope section — HIGH confidence (primary source)
