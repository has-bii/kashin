# Skill: Response Format

## When to Use

When returning data from any service method or route handler.

## Response Shapes

### List with pagination

```typescript
// Return from service.getAll()
return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
```

```json
{ "data": [...], "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
```

### Single item

```typescript
// Return the object directly — Elysia serializes it
return item
```

### Created (201)

```typescript
import { status } from "elysia"
return status(201, result)
```

### Deleted / Updated

```typescript
// Return the deleted or updated object directly
return prisma.{model}.delete({ where: { id, userId } })
return prisma.{model}.update({ where: { id, userId }, data: input })
```

### Auth rejection (in macros only)

```typescript
return status(401, { error: "Unauthorized" })
```

## Rules

- **Never wrap single items in `{ data: item }`** — return the object directly; Elysia serializes it
- **List responses use the paginated shape** — `{ data, total, page, limit, totalPages }`
- **Use `status(201, result)` for creates** — not `status(200, ...)` or bare returns
- **No wrapper for deletes/updates** — return the Prisma result directly
- **No `message` field** — Elysia's default error messages cover the common cases
- HTTP status codes: 200 (ok/default), 201 (created), 400 (bad input), 401 (unauth), 403 (forbidden), 404 (not found), 409 (conflict)
