# Skill: Database

## When to Use

When writing Prisma queries, creating models, or managing data operations.

## File Locations

- Schema: `backend/prisma/schema.prisma`
- Client: `src/lib/prisma.ts` — always import from here
- Generated client: `src/generated/prisma/` (auto-generated)
- Generated TypeBox schemas: `src/generated/prismabox/` (auto-generated)

## Pattern

1. Define/update model in `prisma/schema.prisma`
2. Run `bunx prisma migrate dev --name <description>`
3. Run `bunx prisma generate` (generates both Prisma client and prismabox schemas)
4. Use the shared `prisma` instance from `src/lib/prisma.ts`

## Prisma Client Setup

```typescript
// src/lib/prisma.ts — uses @prisma/adapter-pg driver (Prisma 7 style)
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })
```

## Query Patterns

```typescript
import { prisma } from "../../lib/prisma"

// Paginated list with count — use prisma.$transaction for parallel execution
const [data, total] = await prisma.$transaction([
  prisma.transaction.findMany({
    where,
    include: { category: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  }),
  prisma.transaction.count({ where }),
])
return { data, total, page, limit, totalPages: Math.ceil(total / limit) }

// Dynamic where with optional filters
const where: Record<string, unknown> = { userId }
if (type) where.type = type
if (search) where.OR = [
  { name: { contains: search, mode: "insensitive" as const } },
]

// Atomic write transaction
const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData })
  await tx.inventory.update({ where: { id }, data: { stock: { decrement: 1 } } })
  return order
})
```

## Schema Conventions

```prisma
model Resource {
  id        String   @id @default(uuid(7)) @db.Uuid
  userId    String   @db.Uuid
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Rules

- Always import `prisma` from `src/lib/prisma.ts` — never `new PrismaClient()` elsewhere
- Use `prisma.$transaction([])` for parallel read + count (performance)
- Use `prisma.$transaction(async tx => {})` for atomic multi-step writes
- UUIDs use `uuid(7)` with `@db.Uuid` — always
- Timestamps use `@db.Timestamptz` — always
- After schema changes: `bunx prisma migrate dev` then `bunx prisma generate`
