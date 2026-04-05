---
phase: 3
slug: dashboard-backend
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — no test framework configured yet |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `cd backend && bun run typecheck` |
| **Full suite command** | `cd backend && bun run typecheck` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd backend && bun run typecheck`
- **After every plan wave:** Run `cd backend && bun run typecheck`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | DASH-01 | — | userId filter enforced in all queries | typecheck | `cd backend && bun run typecheck` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | DASH-01 | — | N/A | typecheck | `cd backend && bun run typecheck` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | DASH-01 | — | summary only returns user-owned data | typecheck | `cd backend && bun run typecheck` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | DASH-04 | — | recent transactions only returns user-owned data | typecheck | `cd backend && bun run typecheck` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 3 | DASH-02 | — | category breakdown filtered by userId | typecheck | `cd backend && bun run typecheck` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 3 | DASH-03 | — | monthly trends filtered by userId | typecheck | `cd backend && bun run typecheck` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `cd backend && bun run typecheck` — verify TypeScript compiles after module scaffold
- [ ] Confirm `bun run typecheck` script exists in `backend/package.json` (add if missing: `"typecheck": "tsc --noEmit"`)

*No test framework needed — endpoints are integration-testable via curl/HTTP client post-implementation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Summary returns correct totals for date range | DASH-01 | No test framework | GET /api/dashboard/summary?from=2024-01-01&to=2024-12-31 as authenticated user, verify income/expense/net values |
| Category breakdown groups by category | DASH-02 | No test framework | GET /api/dashboard/categories?from=2024-01-01&to=2024-12-31, verify per-category totals |
| Monthly trends returns N months | DASH-03 | No test framework | GET /api/dashboard/trends?months=6, verify 6 month buckets with zero-fill |
| Recent transactions returns last N | DASH-04 | No test framework | GET /api/dashboard/recent?limit=5, verify 5 most recent transactions returned |
| Unauthenticated request rejected | Security | No test framework | GET /api/dashboard/summary without session cookie, verify 401 response |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
