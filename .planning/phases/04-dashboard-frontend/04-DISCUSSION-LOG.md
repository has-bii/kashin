# Phase 4: dashboard-frontend - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the Q&A.

**Date:** 2026-04-05
**Phase:** 04-dashboard-frontend
**Mode:** discuss
**Areas discussed:** 4th summary card, Feature module structure, Suspense granularity, DataTable / existing placeholders

---

## Areas Discussed

### 4th Summary Card

| Question | Options Presented | Selected |
|----------|-------------------|----------|
| What should the 4th summary card show? | Savings Rate / Transaction count / Leave as placeholder | Savings Rate |
| Backend change needed? | Frontend-compute only / Add transactionCount to backend | Frontend-compute only |

**Outcome:** Savings Rate computed from existing `totalIncome` / `netBalance`. No backend changes. Render `—` when income is zero.

---

### Feature Module Structure

| Question | Options Presented | Selected |
|----------|-------------------|----------|
| Where should dashboard query options and types live? | New features/dashboard/ / Keep in components/ / Flat in components/ | New features/dashboard/ |
| Move existing placeholders into features/dashboard/? | Move into features/dashboard/ / Leave in components/ | Move into features/dashboard/ |

**Outcome:** Full `features/dashboard/` module with `api/`, `components/`, `types/`. Existing placeholders move in and are replaced with live-data versions.

---

### Suspense Granularity

| Question | Options Presented | Selected |
|----------|-------------------|----------|
| How granular should Suspense boundaries be? | Per-widget Suspense / Single page-level Suspense | Per-widget Suspense |

**Outcome:** Each widget is its own `"use client"` + `useSuspenseQuery()` component with individual Suspense boundary in the page.

---

### DataTable / Existing Placeholders

| Question | Options Presented | Selected |
|----------|-------------------|----------|
| What replaces the DataTable on the dashboard page? | Replace with RecentTransactionsWidget / Keep DataTable alongside | Replace with RecentTransactionsWidget |
| What happens to chart-area-interactive.tsx and data.json? | Delete both / Keep chart file / Keep both | Delete both |

**Outcome:** DataTable removed from dashboard page. data.json deleted. chart-area-interactive.tsx deleted. data-table.tsx in components/ is kept (used by transaction page).

---

## Corrections Made

No corrections — all recommended options accepted.

---

## Scope Guardrail Applied

No scope creep attempts during this discussion.
