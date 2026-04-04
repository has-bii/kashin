# Testing Patterns

**Analysis Date:** 2026-04-04

## Test Framework

**Runner:**
- Not detected in codebase
- No test configuration files (jest.config.*, vitest.config.*, etc.)
- No test dependencies in backend or frontend package.json

**Assertion Library:**
- Not detected

**Run Commands:**
- No test commands defined in package.json scripts

**Current Status:**
- **Testing not implemented** — No test files found in source code (test/spec files in node_modules are from external dependencies only)

## Test File Organization

**Location:**
- Would follow co-located pattern if implemented (based on project structure)
- Likely location: `src/modules/<name>/<name>.test.ts` (backend), `src/features/<name>/__tests__/*.test.tsx` (frontend)

**Naming:**
- Likely: `*.test.ts`, `*.test.tsx`, or `*.spec.ts`

**Structure:**
- Likely directory structure if adopted:
```
backend/src/
└── modules/
    └── category/
        ├── index.ts
        ├── service.ts
        ├── query.ts
        └── category.test.ts

frontend/src/
└── features/
    └── category/
        ├── components/
        │   ├── category-card.tsx
        │   └── __tests__/
        │       └── category-card.test.tsx
        └── hooks/
            └── __tests__/
                └── use-category.test.ts
```

## Test Structure

**If testing were implemented, patterns would likely be:**

```typescript
// Backend service test (hypothetical)
import { describe, it, expect, beforeEach } from "bun:test"
import { CategoryService } from "./service"
import { prisma } from "@/lib/prisma"

describe("CategoryService", () => {
  beforeEach(async () => {
    // Setup test data
  })

  it("should create a category", async () => {
    const result = await CategoryService.create(userId, input)
    expect(result.id).toBeDefined()
  })

  it("should throw Conflict if category name exists", async () => {
    expect(() => CategoryService.create(userId, input)).toThrow(Conflict)
  })
})
```

```typescript
// Frontend component test (hypothetical)
import { render, screen } from "@testing-library/react"
import { CategoryCard } from "./category-card"

describe("CategoryCard", () => {
  it("should render category name", () => {
    render(<CategoryCard name="Food" icon="🍔" color="#ff0000" type="expense" />)
    expect(screen.getByText("Food")).toBeInTheDocument()
  })
})
```

## Mocking

**Framework:**
- Not detected

**Patterns:**
- Would likely use Bun's native test utilities for backend
- Would likely use Jest/Vitest for frontend

**What to Mock:**
- Backend: Prisma client queries (via prisma-mock or similar)
- Backend: HTTP requests (via supertest or similar)
- Frontend: API calls (via MSW or similar)
- Frontend: Auth client (via mock)

**What NOT to Mock:**
- Validation schemas (test real schema behavior)
- Business logic in services (test actual behavior)
- React component rendering (unless testing composition)
- Error classes (test real error throwing)

## Fixtures and Factories

**Test Data:**
- Not detected in codebase

**Likely approach if implemented:**
```typescript
// backend/src/modules/category/__fixtures__/category.fixtures.ts
export const mockCategoryInput = {
  name: "Food",
  icon: "🍔",
  color: "#ff0000",
  type: "expense" as const,
}

export const mockCategory = {
  id: "uuid-v7-here",
  userId: "user-id-here",
  ...mockCategoryInput,
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

**Location:**
- Would likely be: `src/modules/<name>/__fixtures__/` (backend)
- Would likely be: `src/features/<name>/__fixtures__/` (frontend)

## Coverage

**Requirements:**
- Not enforced (no coverage configuration)

**View Coverage:**
- Would be: `bun test --coverage` (backend, if implemented)
- Would be: `pnpm test --coverage` (frontend, if implemented)

## Test Types

**Unit Tests:**
- **Should test:** Service methods (category CRUD, validation logic)
- **Should test:** Utility functions (cn(), formatting)
- **Should test:** Validation schemas (Zod validators)
- **Should test:** React component props/rendering

**Integration Tests:**
- **Should test:** Complete API flows (create category → verify in DB)
- **Should test:** Auth flows (login → protected endpoint access)
- **Should test:** Form submission → API call → state update

**E2E Tests:**
- Not detected
- Would likely use Playwright or Cypress if implemented
- Would test: Complete user workflows (auth login → category creation → view)

## Common Patterns

**Async Testing:**
- Backend: Use `async/await` with try-catch in test
- Frontend: Use `waitFor()` from testing-library for async state updates

```typescript
// Backend example (hypothetical)
it("should create category", async () => {
  const result = await CategoryService.create(userId, input)
  expect(result.id).toBeDefined()
})

// Frontend example (hypothetical)
it("should submit form", async () => {
  render(<CategoryCreateForm />)
  await userEvent.type(screen.getByRole("textbox"), "Food")
  await userEvent.click(screen.getByRole("button", { name: /create/i }))
  await waitFor(() => {
    expect(screen.getByText("Category created")).toBeInTheDocument()
  })
})
```

**Error Testing:**
- Backend: Expect thrown errors:
```typescript
it("should throw Conflict on duplicate name", async () => {
  const input = { name: "Food", ... }
  await CategoryService.create(userId, input)
  
  expect(() => CategoryService.create(userId, input))
    .toThrow(Conflict)
})
```

- Frontend: Test error state display:
```typescript
it("should display error message", async () => {
  mockApiCall.mockRejectedValue(new Error("Network error"))
  render(<CategoryCreateForm />)
  await userEvent.click(screen.getByRole("button"))
  
  expect(screen.getByText("Network error")).toBeInTheDocument()
})
```

## Recommended Testing Stack

**Backend:**
- Runner: Bun's native test (`bun:test`)
- Framework: Bun test runner
- HTTP testing: Supertest (for API route testing)
- DB mocking: Prisma mock or test database

**Frontend:**
- Runner: Vitest (aligns with Next.js, fast)
- Framework: React Testing Library (component testing)
- E2E: Playwright (if E2E needed)
- API mocking: MSW (already in dependencies for some packages)

---

*Testing analysis: 2026-04-04*
