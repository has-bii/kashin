# Conventions

## File Naming

- All files: `kebab-case` (e.g., `format-amount.ts`, `category-colors.ts`, `auth-client.ts`)
- React components: `kebab-case.tsx` (e.g., `data-table.tsx`, `responsive-dialog.tsx`)
- Next.js special files: `page.tsx`, `layout.tsx`, `globals.css` (framework convention)
- Backend modules: directory name = domain (e.g., `modules/transaction/index.ts`)

## Code Naming

- Variables/functions: `camelCase`
- Types/interfaces: `PascalCase`
- React components: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE` for true constants, `camelCase` for exported objects
- Hooks: prefixed with `use` (e.g., `useMobile`)
- Backend controllers: `{domain}Controller` (e.g., `transactionController`)
- Backend services: `{Domain}Service` (e.g., `TransactionService`)

## Exports

- Backend: named exports only — no default exports
- Frontend: mix — Next.js pages use default export (framework requirement); components use named exports
- No barrel files (`index.ts` re-exports) — import directly from source files

## Other Rules

- React Compiler is active — never add `React.memo`, `useMemo`, or `useCallback`
- Imports sorted by `@trivago/prettier-plugin-sort-imports` (auto on format)
- Tailwind classes sorted by `prettier-plugin-tailwindcss` (auto on format)
