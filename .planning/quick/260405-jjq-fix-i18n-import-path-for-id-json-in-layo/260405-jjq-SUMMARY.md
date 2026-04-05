---
phase: 260405-jjq
plan: 01
type: execute
subsystem: frontend/i18n
tags: [i18n, refactoring, import-paths]
dependency_graph:
  requires: []
  provides:
    - Clean @/messages/ import paths for locale JSON files
  affects:
    - frontend/src/app/layout.tsx
tech_stack:
  added: []
  patterns:
    - Next.js path alias (@/ resolves to src/)
    - Static + dynamic imports for locale files
key_files:
  created:
    - frontend/src/messages/en.json
    - frontend/src/messages/id.json
  modified:
    - frontend/src/app/layout.tsx
decisions:
  - Kept static import for en.json (always loaded)
  - Kept dynamic import for id.json (conditionally loaded)
metrics:
  tasks_completed: 1
  started: "2025-04-05T00:00:00Z"
  completed: "2025-04-05T00:00:00Z"
---

# Phase 260405-jjq Plan 01: Fix i18n Import Path for id.json in layout.tsx Summary

Move locale messages from `frontend/messages/` into `frontend/src/messages/` and update import paths in layout.tsx to use clean `@/messages/` aliases.

## Tasks Completed

### Task 1: Move messages/ into src/messages/ and update imports

**Files affected:**
- `frontend/messages/en.json` → `frontend/src/messages/en.json`
- `frontend/messages/id.json` → `frontend/src/messages/id.json`
- `frontend/src/app/layout.tsx`

**Changes:**
- Created `frontend/src/messages/` directory
- Moved `en.json` and `id.json` from `frontend/messages/`
- Removed empty `frontend/messages/` directory
- Updated static import: `@/../../messages/en.json` → `@/messages/en.json`
- Updated dynamic import: `@/../../messages/id.json` → `@/messages/id.json`

**Verification:**
- Both locale files exist at `frontend/src/messages/`
- Old `frontend/messages/` directory no longer exists
- Git recognized both files as renames

**Commit:** `0aa653e` — `fix(i18n): move messages to src/messages and fix import paths`

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None. The locale selection already defaults to "en" for unknown cookie values, preventing arbitrary path injection (T-260405-jjq-01 mitigation unchanged).

## Self-Check: PASSED
