<!-- generated-by: gsd-doc-writer -->
# Testing

## Test Framework and Setup

No test framework is currently configured in Kashin. Neither `backend/package.json` nor `frontend/package.json` includes a test runner (Jest, Vitest, Mocha, or equivalent) in their dependencies, and no `jest.config.*` or `vitest.config.*` file exists in either package.

The root `CLAUDE.md` notes: "Not yet configured (framework ready for Jest/Vitest)."

**Recommended setup when tests are added:**

- **Backend (Bun):** Bun ships with a built-in test runner (`bun test`) — no additional install required. Test files follow the `*.test.ts` naming convention.
- **Frontend (Next.js + React 19):** Vitest with `@vitejs/plugin-react` is the recommended pairing for the React 19 + React Compiler setup used in this project.

## Running Tests

No `test` script exists in either package at this time.

Once a framework is configured, the expected commands will be:

```bash
# Backend — Bun built-in runner
cd backend && bun test

# Frontend — Vitest (when configured)
cd frontend && pnpm test
```

## Writing New Tests

No test files exist yet. The following conventions apply once tests are added, based on the project's existing code organization:

**Backend (`backend/src/`)**

- Place test files adjacent to source files or in a `__tests__/` subdirectory within each module directory.
- Naming convention: `*.test.ts` (e.g., `src/modules/category/service.test.ts`).
- Service classes are the primary unit-test target — each static method in `*Service` should have corresponding test coverage.
- Mock the Prisma client to avoid database I/O in unit tests.

**Frontend (`frontend/src/`)**

- Place test files adjacent to the component or hook being tested.
- Naming convention: `*.test.tsx` for components, `*.test.ts` for hooks and utilities.
- Feature hooks in `src/features/<name>/hooks/` are the primary unit-test targets.
- Use `@testing-library/react` for component rendering tests.

**Shared helpers**

No shared test helpers or setup files exist yet. When added, place them at:

- `backend/src/test/setup.ts` — database mock initialization
- `frontend/src/test/setup.ts` — global test environment configuration (e.g., `@testing-library/jest-dom` matchers)

## Coverage Requirements

No coverage thresholds are configured.

When coverage is enabled, add thresholds to the appropriate config file:

- **Bun:** `bunfig.toml` `[test]` section — `coverageThreshold`
- **Vitest:** `vitest.config.ts` `coverage.thresholds` block

No minimum coverage threshold is enforced at this time.

## CI Integration

No CI/CD workflows are configured (no `.github/workflows/` directory exists in the repository). Tests are not run automatically on push or pull request.

When a CI pipeline is added, the recommended test step for each package is:

```yaml
- name: Run backend tests
  working-directory: backend
  run: bun test

- name: Run frontend tests
  working-directory: frontend
  run: pnpm test
```
