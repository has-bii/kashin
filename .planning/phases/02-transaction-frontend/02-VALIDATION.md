---
phase: 2
slug: transaction-frontend
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-04
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (not yet installed — Wave 0 installs) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `pnpm test --run` |
| **Full suite command** | `pnpm test --run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test --run`
- **After every plan wave:** Run `pnpm test --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | TXN-01 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | TXN-02 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | TXN-03 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | TXN-04 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | TXN-01 | manual | n/a | n/a | ⬜ pending |
| 02-02-02 | 02 | 1 | TXN-02 | manual | n/a | n/a | ⬜ pending |
| 02-02-03 | 02 | 1 | TXN-03 | manual | n/a | n/a | ⬜ pending |
| 02-03-01 | 03 | 2 | TXN-04 | manual | n/a | n/a | ⬜ pending |
| 02-03-02 | 03 | 2 | TXN-04 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 3 | TXN-05 | manual | n/a | n/a | ⬜ pending |
| 02-04-02 | 04 | 3 | EXPORT-01 | manual | n/a | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/src/features/transaction/__tests__/query-options.test.ts` — unit stubs for TanStack Query option factories (TXN-01..04)
- [ ] `frontend/src/features/transaction/__tests__/filter-utils.test.ts` — URL param parsing tests (TXN-04)
- [ ] Install vitest + @testing-library/react if not present

*No existing test infrastructure detected — Wave 0 must install.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Create transaction form submits and record appears | TXN-01 | UI interaction | Open form, fill fields, save — verify in list |
| Edit transaction updates immediately | TXN-02 | UI interaction | Click row, edit, save — verify updated |
| Delete confirmation dialog and removal | TXN-03 | UI interaction | Click delete, confirm — verify removed |
| Filter by date range, type, category | TXN-04 | URL state + UI | Apply filters — verify list + URL update |
| Bulk-select and bulk-delete | TXN-05 | UI interaction | Select rows, bulk delete — verify removed |
| CSV export downloads file | EXPORT-01 | File download | Click export — verify file downloads |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
