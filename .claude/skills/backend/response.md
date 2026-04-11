# Skill: Response Format

## When to Use

When returning data from any service method.

## Response Shapes

### Single item — return directly
```typescript
return prisma.transaction.findUnique({ where: { id } })
// → { id, amount, ... }
```

### Create — use status() for 201
```typescript
import { status } from "elysia"

const result = await prisma.transaction.create({ data: input })
return status(201, result)
// → HTTP 201 + { id, amount, ... }
```

### Paginated list
```typescript
const [data, total] = await prisma.$transaction([
  prisma.transaction.findMany({ where, skip, take: limit }),
  prisma.transaction.count({ where }),
])
return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
// → { data: [...], total: 42, page: 1, limit: 20, totalPages: 3 }
```

### Delete — return deleted record
```typescript
return prisma.transaction.delete({ where: { id } })
// → HTTP 200 + deleted record
```

### Special responses (file download, etc.)
```typescript
return new Response(csvContent, {
  headers: {
    "Content-Type": "text/csv",
    "Content-Disposition": 'attachment; filename="export.csv"',
  },
})
```

## HTTP Status Codes

| Action | Code | How |
|--------|------|-----|
| Read (GET) | 200 | Default |
| Create (POST) | 201 | `return status(201, result)` |
| Update (PUT) | 200 | Default |
| Delete (DELETE) | 200 | Default (returns deleted record) |
| Not found | 404 | `throw new NotFoundError(...)` |
| Conflict | 409 | `throw new Conflict(...)` |
| Unauthorized | 401 | authMacro handles automatically |

## Rules

- Return data directly from Prisma — no `{ data: result }` wrapper on single items
- Paginated lists use `{ data, total, page, limit, totalPages }` shape
- Creates must use `status(201, result)` — not just `return result`
- Import `status` from `"elysia"`, not from anywhere else
