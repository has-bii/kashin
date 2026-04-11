# Skill: Backend Testing

## When to Use

When writing tests for backend service logic or API endpoints.

## Setup

No test files exist yet in this project. When adding tests:

- Test runner: **Bun test** (`bun test`)
- Test files: colocated as `modules/{domain}/{domain}.test.ts`
- No separate test directory — tests live next to the source

## Pattern

```typescript
// modules/{domain}/{domain}.test.ts
import { describe, expect, it, beforeEach, afterEach } from "bun:test"
import { prisma } from "../../lib/prisma"

describe("{Domain}Service", () => {
  const testUserId = "test-user-id"

  afterEach(async () => {
    await prisma.{domain}.deleteMany({ where: { userId: testUserId } })
  })

  describe("getAll", () => {
    it("returns paginated results scoped to userId", async () => {
      // arrange — seed test data
      await prisma.{domain}.create({ data: { userId: testUserId, ... } })

      // act
      const result = await {Domain}Service.getAll(testUserId, { page: 1, limit: 20 })

      // assert
      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.data[0].userId).toBe(testUserId)
    })
  })

  describe("create", () => {
    it("returns 201 status with created record", async () => {
      const result = await {Domain}Service.create(testUserId, { ... })
      expect(result.status).toBe(201)
    })
  })

  describe("getById", () => {
    it("throws NotFoundError when record does not exist", async () => {
      expect({Domain}Service.getById(testUserId, "non-existent-id")).rejects.toThrow("doesn't exist")
    })
  })
})
```

## Running Tests

```bash
cd backend && bun test
cd backend && bun test modules/{domain}/{domain}.test.ts  # single file
```

## Rules

- Test against a real database — never mock Prisma
- Always clean up test data in `afterEach` — use the same `userId` pattern for easy cleanup
- Test service methods directly — not HTTP routes (Elysia handles the HTTP layer)
- Use `bun:test` imports, not `jest` or `vitest`
- Each test file cleans up its own data — never assume database state from other tests
