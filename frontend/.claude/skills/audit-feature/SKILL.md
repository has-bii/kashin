---
name: audit-feature
description: >
  Audits a kashin frontend feature (src/features/<name>/) against project
  conventions and fixes any violations found. Use this skill whenever the user
  asks to "check", "audit", "review", "validate", or "fix" a feature's
  structure or code conventions — even if they just say "does X follow
  conventions?" or "clean up the Y feature". Also trigger when the user says
  a feature "looks wrong" or "needs to be updated to match the new patterns".
user-invocable: true
---

# Audit Feature

Inspect a feature in `src/features/<name>/`, identify convention violations, and fix them.

## Step 1: Identify the feature

If the user didn't name a feature, ask for it. Once you have the name, read the directory:

```
src/features/<name>/
```

List all subdirectories and files. This tells you which layout the feature is using.

## Step 2: Determine the layout

**Extended layout** — feature has any of: `context/`, `provider/`, `mutations/`, `query/`  
**Minimal layout** — none of the above are present

The layout determines what checks apply and what the expected structure is.

### Expected structure

**Minimal:**
```
api/            # Raw HTTP functions + queryOptions factories (get-<name>.query.ts)
components/
hooks/          # useXxxForm, useXxxMutation, useXxxFilter
types/
validations/
```

**Extended:**
```
api/            # Raw HTTP functions ONLY
query/          # QUERY_KEY constant + getXxxQueryOptions factory
mutations/      # useMutation hooks (toast + invalidateQueries here)
context/        # XxxContextType interface + createContext (no state)
provider/       # XxxProvider with useState dialog state
hooks/          # useXxxContext, useXxxForm, useXxxFilter
components/
types/
validations/
```

## Step 3: Run checks

Read all files in the feature. Check each area:

### api/ checks

**Both layouts:**
- Raw HTTP functions must destructure `{ data }` from Axios and return `data` directly
- Functions must be typed: `api.get<ReturnType>()`
- No React hooks (`use*`) in this folder

**Extended layout only:**
- Must NOT contain `queryOptions` — those go in `query/`
- Must NOT contain `useMutation` — those go in `mutations/`

**Minimal layout only:**
- Must have a `get-<name>.query.ts` file with `getXxxQueryOptions` and `getXxxQueryKey` exports

### query/ checks (extended only)

- Must export a `QUERY_KEY` constant (e.g. `CATEGORIES_QUERY_KEY = "categories" as const`)
- Must export a `getXxxQueryOptions(params)` that calls `queryOptions({ queryKey, queryFn })`
- `queryFn` must import from `../api` — no direct `api.get()` calls here
- No React hooks in this file

### mutations/ checks (extended only)

- Must export `useXxxMutation` hooks (named with `Mutation` suffix)
- Must import `QUERY_KEY` from `../query` — no hardcoded query key strings
- Must call `queryClient.invalidateQueries` in `onSuccess`
- Must call `toast.success` in `onSuccess` and `toast.error` in `onError`
- `onError` must use `e.message` with a fallback: `e.message || "fallback text"`

### context/ checks (extended only)

- Must export the context type interface (`XxxContextType`)
- Must export `createContext<XxxContextType | null>(null)`
- Must NOT contain `useState`, `useEffect`, or handler implementations — those go in `provider/`

### provider/ checks (extended only)

- Must export a `XxxProvider({ children })` component
- Must have `useState` for each dialog's `open` and `selected` state
- Must derive `dialogMode` from selected state (not a separate `useState`)
- Must import context from `../context/<name>.context`
- Must NOT contain query calls or mutation calls

### hooks/ checks

**Extended layout:**
- Must have `use-<name>-context.ts` with a null guard: `if (!context) throw new Error(...)`
- Must NOT contain `useMutation` — those belong in `mutations/`
- `useXxxForm` must import the mutation from `../mutations`, not define it inline

**Both layouts:**
- Filter hooks must use `nuqs` (`useQueryState` / `parseAsStringEnum`) — not raw `useSearchParams`

### components/ checks (all files)

- **No manual `useMemo` or `useCallback`** — React Compiler is active; these are redundant and should be removed. Replace `useMemo(() => expr, [dep])` with a plain `const`.
- **No placeholder text** — search for: "I don't know", "TODO", "lorem ipsum", "placeholder", "written here", "test text". These must be replaced with real copy or removed.
- **Map keys must be stable identifiers** — if you see `key={item.label}` or `key={item.name}` in a `.map()`, check whether `item.value` or `item.id` would be more appropriate.
- **AlertDialog/Dialog descriptions must be specific** — generic copy like "delete your account" in a category delete dialog is a bug.

### validations/ checks

- Must import from `"zod/v4"` (not `"zod"`)
- Must export both the schema (`xyzSchema`) and inferred type (`XyzDto`)

### types/ checks

- Must be in `index.ts`
- DTO types must have `Dto` suffix (e.g. `CategoryDto`)

## Step 4: Report findings

List every violation grouped by severity:

**Bug** — wrong behavior visible to users (wrong copy, bad keys)  
**Convention** — structural or pattern deviation  
**Performance** — unnecessary code the React Compiler already handles

For each violation, state:
- File path (relative to `src/features/<name>/`)
- What's wrong
- What it should be

## Step 5: Fix

Ask for confirmation if there are many changes, then fix everything. Apply fixes precisely:

- For `useMemo` removal: delete the import and replace the `useMemo(() => ..., [dep])` call with a plain `const` assignment. If the logic is complex, you can simplify it (e.g. `find(...) ?? fallback` instead of an if/else).
- For wrong copy: replace with accurate, production-ready text. If unsure, write something plausible and note it.
- For bad keys: change `key={item.label}` → `key={item.value}` (or `key={item.id}` for entity lists).
- For structural violations (e.g. `queryOptions` in `api/` when it should be in `query/`): move the code and update all import paths.
- For mutations in `hooks/`: move the `useMutation` block to `mutations/index.ts`, update the hook to import from `../mutations`.

After fixing, run `pnpm run lint` and `npx tsc --noEmit` to verify no new errors were introduced.

## Conventions reference

The authoritative source for patterns is `docs/conventions.md`. The area skills in `.claude/skills/feature-*/SKILL.md` have detailed code examples for each layer. When in doubt about a pattern, read the relevant area skill.
