---
phase: 4
slug: dashboard-frontend
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (not yet installed — Wave 0 installs) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `pnpm --filter frontend test --run` |
| **Full suite command** | `pnpm --filter frontend test --run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter frontend test --run`
- **After every plan wave:** Run `pnpm --filter frontend test --run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | DASH-01 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 1 | DASH-02 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |
| 4-01-03 | 01 | 1 | DASH-03 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |
| 4-01-04 | 01 | 1 | DASH-04 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 2 | DASH-01 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 2 | DASH-04 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |
| 4-03-01 | 03 | 2 | DASH-02 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |
| 4-03-02 | 03 | 2 | DASH-03 | — | N/A | unit | `pnpm --filter frontend test --run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/src/__tests__/dashboard/balance-card.test.tsx` — stubs for DASH-01
- [ ] `frontend/src/__tests__/dashboard/recent-transactions.test.tsx` — stubs for DASH-04
- [ ] `frontend/src/__tests__/dashboard/category-chart.test.tsx` — stubs for DASH-02
- [ ] `frontend/src/__tests__/dashboard/monthly-chart.test.tsx` — stubs for DASH-03
- [ ] vitest + @testing-library/react install if not present

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Charts render correctly in browser | DASH-02, DASH-03 | SVG/Canvas rendering not testable in jsdom | Open dashboard, verify donut and bar charts display with data |
| Suspense skeletons appear during load | DASH-01–04 | Requires network throttling | Throttle to Slow 3G in DevTools, confirm skeletons show before data |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
