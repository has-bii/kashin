# Skill: Backend Testing

## When to Use

When writing tests for backend services or endpoints.

## Test Framework

**Bun test** (`bun:test`) — built into the runtime, no extra install needed.

```typescript
import { describe, it, expect, beforeAll, afterAll } from "bun:test"
```

Run tests with: `bun test`

## File Locations

- Tests colocated with source: `src/modules/<name>/<name>.test.ts`
- Or in a top-level folder: `tests/<name>.test.ts`

No test files currently exist in the project — establish the pattern with the first one.

## Unit Test — Service

Test service methods in isolation by mocking Prisma:

```typescript
import { describe, it, expect, mock, beforeEach } from "bun:test"
import { TransactionService } from "./service"

// Mock the prisma module
mock.module("../../lib/prisma", () => ({
  prisma: {
    transaction: {
      findMany: mock(() => Promise.resolve([])),
      count: mock(() => Promise.resolve(0)),
      findUnique: mock(() => Promise.resolve(null)),
      create: mock(() => Promise.resolve({ id: "1", amount: 100 })),
    },
    $transaction: mock((queries: unknown[]) => Promise.all(queries as Promise<unknown>[])),
  },
}))

describe("TransactionService", () => {
  describe("getById", () => {
    it("throws NotFoundError when transaction does not exist", async () => {
      await expect(TransactionService.getById("user-1", "nonexistent")).rejects.toThrow("not found")
    })
  })
})
```

## Integration Test — Endpoint

Test the full HTTP request/response cycle using Elysia's test utilities:

```typescript
import { describe, it, expect } from "bun:test"
import { treaty } from "@elysiajs/eden"
import { transactionController } from "./index"

const app = treaty(transactionController)

describe("GET /transaction", () => {
  it("returns 401 without auth", async () => {
    const { status } = await app.transaction.get()
    expect(status).toBe(401)
  })
})
```

## Rules

- Use `bun test` — not jest, not vitest
- Use `mock.module()` to mock Prisma — never hit the real DB in unit tests
- Test behavior, not implementation details
- Name tests descriptively: `"throws NotFoundError when transaction does not exist"`
- For integration tests, use `@elysiajs/eden` treaty client
