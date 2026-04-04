# Kashin

## What This Is

Kashin is a personal expense and income tracker for individuals. Users manually log transactions, organize them by category, and view spending summaries via a dashboard. Future versions add AI-powered email receipt extraction and paid subscriptions.

## Core Value

A fast, frictionless way to log and visualize personal finances — before any AI automation, subscriptions, or mobile features exist.

## Requirements

### Validated

- ✓ User authentication (email/password + Google OAuth + email OTP) — existing
- ✓ Category management (CRUD) — existing

### Active

**Milestone 1 — Transaction Core + Dashboard**

- [ ] Transaction CRUD: create, edit, delete entries with type (expense/income), amount, date, category, and optional note/vendor
- [ ] Dashboard: spending breakdown by category (chart)
- [ ] Dashboard: income vs. expenses balance overview
- [ ] Dashboard: monthly spending trends (chart)
- [ ] Dashboard: recent transactions list with filters

### Out of Scope

- AI email receipt extraction — v2 (forward email → AI extracts → in-app review queue)
- Stripe subscriptions / billing — v3
- Mobile app — after web app ships
- Team/multi-tenant workspaces — personal use only; multi-user not needed
- Browser/native push notifications — in-app alert/badge only for now
- Budget goals / alerts — not part of v1 scope

## Context

**Existing foundation:**
- Backend: Bun + Elysia, Prisma 7 ORM, PostgreSQL (`@prisma/adapter-pg`), Better Auth
- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, TanStack React Form
- Auth and category modules are complete and follow established patterns
- Module pattern: `backend/src/modules/<name>/` (index.ts controller, service.ts logic), `frontend/src/features/<name>/` 
- Validation: prismabox (auto-generated from Prisma) on backend, Zod v4 on frontend

**v2 email flow (for context when designing data model):**
- Users forward receipts to a dedicated address
- AI extracts: vendor, amount, date, suggested category
- In-app pending queue for user to confirm or edit before saving
- AI suggests a category name; user maps it to their own categories

**v3 billing:**
- Stripe subscriptions with free tier and paid plans
- Individual users pay, not teams

## Constraints

- **Tech stack**: Bun + Elysia + Prisma + PostgreSQL (backend), Next.js + shadcn/ui (frontend) — established, do not deviate
- **Auth**: Better Auth is configured and integrated — do not swap
- **IDs**: UUID v7 for user-facing tables, BigInt auto-increment for internal tables
- **Data model**: Design transaction schema to accommodate v2 email extraction fields without migration pain

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| v1 = manual CRUD + dashboard only | Email AI is the differentiator but needs a working foundation first | — Pending |
| In-app alerts (no push) for pending review queue | Web app first; native push deferred to mobile app | — Pending |
| AI suggests category → user maps | Users already have their own category taxonomy; AI shouldn't override | — Pending |

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
*Last updated: 2026-04-04 after initialization*
