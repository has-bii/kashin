---
name: feature-types
description: >
  Area skill for implementing the types layer of a kashin frontend feature.
  Loaded by implement-feature (not invoked directly). Covers TypeScript
  interface definitions, DTO naming, and the single-file pattern for
  src/features/<name>/types/index.ts.
user-invocable: false
---

# Feature Types Layer

Implement `types/index.ts` for the feature. This file is the single source of truth for all TypeScript types within a feature module.

## What Goes Here

- **Entity interface** — shape of a record returned from the API
- **DTO types** — shapes for create/update request bodies (also exported from `validations/schema.ts` via `z.infer<>`, but re-export or define here as canonical)
- **Filter/param types** — query parameter shapes for list endpoints
- **Enum-like unions** — string literal unions specific to this feature

## Pattern

```ts
// Entity — matches the API response shape exactly
export interface FeatureName {
  id: string;
  name: string;
  userId: string;
  createdAt: string; // ISO date string from API
  updatedAt: string;
}

// DTOs — match the Zod schemas in validations/schema.ts
export interface FeatureNameCreateDto {
  name: string;
  type: FeatureNameType;
}

export interface FeatureNameUpdateDto extends Partial<FeatureNameCreateDto> {}

// Params for list queries
export interface GetFeatureNamesParams {
  page?: number;
  limit?: number;
  search?: string;
}

// String literal union (if applicable)
export type FeatureNameType = "typeA" | "typeB";
```

## Naming Rules

| Thing | Convention | Example |
|-------|-----------|---------|
| Entity | `PascalCase` (feature name) | `Transaction`, `Category` |
| Create DTO | `<Entity>CreateDto` | `TransactionCreateDto` |
| Update DTO | `<Entity>UpdateDto` | `TransactionUpdateDto` |
| List params | `Get<Entity>sParams` | `GetTransactionsParams` |
| Type union | `<Entity><Field>` | `TransactionType` |

## Key Rules

- Use `interface` for object shapes (not `type` aliases)
- Use `type` only for unions, intersections, or primitives
- Date fields from the API arrive as `string` (ISO 8601) — don't use `Date`
- IDs are always `string` (Prisma uses cuid/uuid)
- Keep DTO interfaces in sync with Zod schemas in `validations/schema.ts`
- Don't import from other feature modules — types used across features go in `src/types/`
