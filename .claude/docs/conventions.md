# Conventions

## File Naming

- All files: `kebab-case` (e.g., `transaction-card.tsx`, `get-transactions.query.ts`)
- Backend modules: `index.ts`, `query.ts`, `service.ts` per module
- Frontend feature API files: `<action>-<resource>.ts` or `<action>-<resource>.query.ts`

## Code Naming

- Variables/functions: `camelCase`
- React components: `PascalCase`
- Types/interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE` (inferred)

## Exports

- Backend modules export named exports from `index.ts`
- Frontend features have no barrel `index.ts` — import directly from sub-paths

## Other Rules

- Path alias `@/` maps to `frontend/src/`
- React Compiler is active — never add `React.memo`, `useMemo`, or `useCallback`
- TanStack Query global config (staleTime/gcTime) is set on root QueryClient — don't add per-query
