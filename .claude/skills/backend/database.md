---
name: database
description: Writing Prisma queries, handling transactions, or working with related models. Use when the user asks about database queries, Prisma, transactions, or relations.
---

# Skill: Database

## When to Use

When writing Prisma queries, handling transactions, or working with related models.

## File Locations

- Prisma client: `backend/src/lib/prisma.ts` — always import from here
- Schema: `backend/prisma/schema.prisma`
- Generated client: `backend/src/generated/prisma/` — auto-generated, don't edit
- Generated Prismabox schemas: `backend/src/generated/prismabox/` — auto-generated, don't edit

## Pattern

1. Import `prisma` from `../../lib/prisma` — never `new PrismaClient()`
2. All queries go in `service.ts` methods — never in `index.ts`
3. Use `prisma.$transaction([...])` for parallel reads (count + data)
4. Use `prisma.$transaction(async tx => ...)` for atomic write operations

## Common Patterns

```typescript
import { prisma } from "../../lib/prisma"

// Paginated list with count (parallel transaction)
const [data, total] = await prisma.$transaction([
  prisma.{model}.findMany({
    where,
    include: { relation: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  }),
  prisma.{model}.count({ where }),
])
return { data, total, page, limit, totalPages: Math.ceil(total / limit) }

// Existence check before update/delete
const isExist = await prisma.{model}.findUnique({ where: { id, userId } })
if (!isExist) throw new NotFoundError("{Model} doesn't exist")

// Atomic writes (sequential, rollback on failure)
const result = await prisma.$transaction(async (tx) => {
  const item = await tx.{model}.create({ data: input })
  await tx.{other}.update({ where: { id }, data: { count: { increment: 1 } } })
  return item
})

// Select specific fields (avoid over-fetching)
const categoryInclude = {
  category: { select: { id: true, name: true, type: true, icon: true } },
}
prisma.{model}.findMany({ include: categoryInclude })
```

## Rules

- Always scope queries to `userId` — never query across users
- Use `{ where: { id, userId } }` pattern, not just `{ where: { id } }`
- `prisma.$transaction([...])` = parallel array; `prisma.$transaction(async tx => ...)` = atomic callback
- Run `bunx --bun prisma migrate dev --name {description}` after schema changes
- Run `bunx --bun prisma generate` after schema changes to regenerate Prismabox
- Never touch files in `src/generated/` — they are auto-generated
