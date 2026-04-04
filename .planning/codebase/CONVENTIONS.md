# Coding Conventions

**Analysis Date:** 2026-04-04

## Naming Patterns

**Files:**
- Controllers: `index.ts` (e.g., `src/modules/category/index.ts`)
- Services: `service.ts` (e.g., `src/modules/category/service.ts`)
- Query validators: `query.ts` (e.g., `src/modules/category/query.ts`)
- Validation schemas: `*.schema.ts` (e.g., `change-email.schema.ts`)
- Hooks: `use-<action>.ts` (e.g., `use-change-email-form.ts`)
- Query configs: `<name>.query.ts` (e.g., `get-account-list.query.ts`)
- Components: PascalCase `.tsx` (e.g., `CategoryCard.tsx`) or `change-avatar-form.tsx`
- Features: kebab-case directory names (e.g., `features/settings/profile/`)

**Functions:**
- camelCase for regular functions: `getAll()`, `create()`, `update()`, `delete()`
- PascalCase for React components: `CategoryCard()`, `ChangeEmailForm()`
- Service methods: static methods in abstract classes: `CategoryService.create()`

**Variables:**
- camelCase: `userId`, `newEmail`, `dialogStep`, `resendCooldown`
- Typed state variables with clear intent: `[dialogStep, setDialogStep]`, `[error, setError]`
- Private refs with suffix: `intervalRef`, `containerRef`

**Types:**
- DTOs/Inferred types: `CategoryCreateDto`, `ChangeEmailDto`
- Zod schemas: `categoryCreateSchema`, `changeEmailSchema`
- Enums: `DialogStep` ("idle" | "verify-current" | "verify-new")
- Type imports: `type Props`, `type Category`

## Code Style

**Formatting:**
- Prettier v3.8.1 with import sorting plugin
- Print width: 100 characters
- Semicolons: disabled (semi: false)
- Single quotes: disabled (singleQuote: false) — use double quotes
- Indentation: 2 spaces (Prettier default)

**Linting:**
- ESLint 9 on frontend with Next.js config
- TanStack Query ESLint plugin enabled on frontend
- No backend linting configured
- Frontend: ESLint rule overrides: `react/no-children-prop: off`

**TypeScript:**
- Backend: target: ESNext, module: nodenext, strict: true
- Frontend: target: ES2017, lib: [dom, dom.iterable, esnext], strict: true, incremental: true
- Both: forceConsistentCasingInFileNames: true, skipLibCheck: true
- Frontend-specific: jsx: react-jsx, isolatedModules: true, moduleResolution: bundler

## Import Organization

**Order:**
1. Third-party library imports (e.g., `import axios from "axios"`)
2. Internal shared imports (e.g., `from "@/lib"`, `from "@/components"`)
3. Feature-specific imports (e.g., `from "../validations"`, `from "./service"`)
4. Type imports (e.g., `import type { Category }`)

**Path Aliases:**
- Frontend: `@/*` → `./src/*`
- Backend: No path aliases configured; use relative imports

**Import Separation:** Imports are separated by groups (configured via `@trivago/prettier-plugin-sort-imports`)

**Specifier Sorting:** Imports are sorted alphabetically within groups (importOrderSortSpecifiers: true)

## Error Handling

**Backend Patterns:**
- Custom error class: `Conflict` (409 status) in `src/global/error.ts`
- Elysia built-in: `NotFoundError` (404 status)
- Error throwing: `throw new Conflict("message")`, `throw new NotFoundError("message")`
- Status codes: `status(201, data)` for non-200 responses from Elysia
- Service methods should throw, controllers don't catch (Elysia handles)

**Frontend Patterns:**
- Try-catch with type checking: `if (err instanceof Error) { ... } else { ... }`
- Toast notifications: `toast.error()`, `toast.success()` via Sonner
- Error state in hooks: `[error, setError]` for form-level errors
- API errors: Check `error` field in response: `if (error) { setError(...) }`
- No global error boundary detected; errors managed per-feature

## Logging

**Framework:** Console only (no structured logging library)

**Patterns:**
- Startup logs: `console.log(\`🦊 Elysia is running at ...\`)`
- OTP logs: `console.log(\`[OTP] ${email}: ${otp} (${type})\`)` (clearly for development)
- No error logging framework in place; relies on exception throwing

**Guidelines:**
- Use prefixes for log categories: `[OTP]`, etc.
- Log startups and critical operations
- No structured logging in place

## Comments

**When to Comment:**
- Sparse commenting observed; code is mostly self-documenting
- Complex logic explained (e.g., "Check unique name" before DB query)
- Commented code is immediately above the operation it describes

**JSDoc/TSDoc:**
- Not extensively used in codebase
- Type inference preferred; explicit JSDoc minimal

## Function Design

**Size:** 
- Service methods: 5-40 lines (branching for checks, then operation)
- Controller handlers: 1-3 lines (delegate to service)
- Hooks: 50-160 lines (acceptable for stateful logic)

**Parameters:**
- Services: `(userId: string, input?: Type)` or `(userId: string, id: string, ...)`
- Controllers: Extract from context: `{ user, query, body, params }`
- Typed input: Use generated `CategoryPlainInputCreate` types from prismabox

**Return Values:**
- Services return Prisma results directly or wrapped in `status()`
- Controllers return service results (Elysia handles serialization)
- Hooks return object with multiple values: `{ form, otpForm, dialogStep, ... }`

## Module Design

**Exports:**
- Controllers: `export const categoryController = new Elysia(...)`
- Services: `export abstract class CategoryService { static ... }`
- Validations: `export const categoryCreateSchema = z.object(...)`
- Inferred types: `export type CategoryCreateDto = z.infer<typeof categoryCreateSchema>`
- React components: `export function CategoryCard({ ... }) { ... }` or `export default function LoginPage() { ... }`

**Barrel Files:**
- Used in frontend for feature-level exports
- Not observed in backend

**Default Exports:**
- Backend: Controllers are named exports to enable `.use()` in Elysia
- Frontend pages: Default exports (Next.js convention)
- Frontend features: Mixed (some default, some named)

---

*Convention analysis: 2026-04-04*
