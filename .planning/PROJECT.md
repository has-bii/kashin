# Kashin

**Shipped:** v1.0 — Transaction Core + Dashboard (2026-04-05)

## What This Is

Kashin is a personal expense and income tracker for individuals. Users manually log transactions, organize them by category, and view spending summaries via a dashboard. Future versions add AI-powered email receipt extraction and paid subscriptions.

## Core Value

A fast, frictionless way to log and visualize personal finances — before any AI automation, subscriptions, or mobile features exist.

## Requirements

### Validated

- ✓ User authentication (email/password + Google OAuth + email OTP) — pre-v1.0
- ✓ Category management (CRUD) — pre-v1.0
- ✓ Transaction backend API (CRUD + bulk-delete, category/type/date filtering, pagination) — v1.0 Phase 01
- ✓ Transaction frontend UI (create/edit Sheet, delete dialog, filter bar, pagination, bulk-delete, CSV export, user currency display) — v1.0 Phase 02
- ✓ Dashboard: spending breakdown by category chart — v1.0 Phase 03+04
- ✓ Dashboard: income vs. expenses balance overview with savings rate — v1.0 Phase 03+04
- ✓ Dashboard: monthly spending trends chart (trailing 6 months) — v1.0 Phase 03+04
- ✓ Dashboard: recent transactions widget — v1.0 Phase 03+04
- ✓ Transaction CSV export — v1.0 Phase 02

### Active

**Next Milestone — AI Email Receipt Extraction (v2)**

- [ ] Dedicated email address for receipt forwarding
- [ ] AI extraction: vendor, amount, date, suggested category
- [ ] Pending review queue in-app for AI-extracted entries
- [ ] Confirm/edit extracted entries before saving as transactions
- [ ] Category suggestion → user mapping to their own taxonomy

### Out of Scope

- Stripe subscriptions / billing — v3, need v2 working first
- Mobile app — after web app ships
- Team/multi-tenant workspaces — personal use only
- Browser/native push notifications — in-app badge sufficient for web
- Budget goals / alerts — not part of current scope
- Bank sync (Plaid, etc.) — high complexity, not core value
- Multi-currency arithmetic — single-currency for now
- Receipt/attachment uploads — v2 email flow handles this

## Context

**v1.0 shipped:**
- 127 commits across 4 days (2026-04-01 → 2026-04-05)
- ~9,318 lines TypeScript (excluding generated code)
- 12 plans completed across 4 phases
- 100% v1 requirements met (11/11)

**Tech stack:**
- Backend: Bun + Elysia, Prisma 7 ORM, PostgreSQL (`@prisma/adapter-pg`), Better Auth
- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, TanStack React Form, Recharts
- Module pattern: `backend/src/modules/<name>/` (controller + service), `frontend/src/features/<name>/` (types, validations, api, hooks, components)
- Validation: prismabox (auto-generated from Prisma) on backend, Zod v4 on frontend
- React Compiler enabled — no manual memo needed

**Key patterns established:**
- Paginated envelope pattern via `prisma.$transaction([findMany, count])`
- Composite Typebox schemas extending prismabox for extra fields
- nuqs URL state for filters (persistable, shareable URLs)
- next/dynamic with ssr:false for client-only chart components
- All queries scoped by `userId` for security

**Known issues:**
None significant

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| v1 = manual CRUD + dashboard only | Email AI is the differentiator but needs a working foundation first | ✓ Good — shipped complete v1 first |
| In-app alerts (no push) for pending review queue | Web app first; native push deferred to mobile app | — Pending (v2) |
| AI suggests category → user maps | Users already have their own category taxonomy; AI shouldn't override | — Pending (v2) |
| Composite Typebox schemas for categoryId extension | Avoids modifying prismabox-generated types | ✓ Good — DRY, maintainable |
| Custom table instead of data-table.tsx | Design contract D-04 specified simpler implementation | ✓ Good — avoided bloat |
| next/dynamic ssr:false for Recharts | Recharts is client-only | ✓ Good — eliminated SSR flicker |
| React Compiler enabled | Automatic memoization in React 19 | ✓ Good — no manual optimization needed |

## Constraints

- **Tech stack**: Bun + Elysia + Prisma + PostgreSQL (backend), Next.js + shadcn/ui (frontend) — established, do not deviate
- **Auth**: Better Auth is configured and integrated — do not swap
- **IDs**: UUID v7 for user-facing tables, BigInt auto-increment for internal tables
- **Data model**: Design transaction schema to accommodate v2 email extraction fields without migration pain

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-05 — v1.0 milestone complete*
