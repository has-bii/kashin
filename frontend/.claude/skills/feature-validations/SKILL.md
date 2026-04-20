---
name: feature-validations
description: >
  Area skill for implementing the validations layer of a kashin frontend feature.
  Loaded by implement-feature (not invoked directly). Covers Zod v4 schema
  patterns, DTO type inference, and the single-file pattern for
  src/features/<name>/validations/schema.ts.
user-invocable: false
---

# Feature Validations Layer

Implement `validations/schema.ts` for the feature. This file defines Zod schemas used for form validation (via TanStack Form's `validators.onSubmit`) and exports inferred DTO types.

## Import

Always import from `"zod/v4"` — not `"zod"`:

```ts
import { z } from "zod/v4";
```

## Pattern

```ts
import { z } from "zod/v4";

// Create schema
export const featureNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  amount: z.number().positive("Must be positive"),
  type: z.enum(["typeA", "typeB"]),
  categoryId: z.string().nullable(),
  note: z.string().max(500).optional(),
});

// Update schema — all fields optional
export const featureNameUpdateSchema = featureNameSchema.partial();

// Inferred types — these are the canonical DTO types
export type FeatureNameCreateDto = z.infer<typeof featureNameSchema>;
export type FeatureNameUpdateDto = z.infer<typeof featureNameUpdateSchema>;
```

## Field Patterns

| Field type | Zod expression |
|-----------|---------------|
| Required string | `z.string().min(1, "Required")` |
| String with max | `z.string().min(1).max(255)` |
| Positive number | `z.number().positive()` |
| Integer | `z.number().int().positive()` |
| Enum | `z.enum(["a", "b"])` |
| Nullable FK | `z.string().nullable()` |
| Optional string | `z.string().optional()` |
| Date string | `z.string()` (dates arrive as ISO strings) |
| Boolean | `z.boolean()` |

## Rules

- Always export both the schema AND the inferred type from this file
- Update schema = `baseSchema.partial()` — never manually duplicate fields
- Custom error messages in Indonesian if the app surfaces them to users (e.g. `"Wajib diisi"`)
- Keep validation rules consistent with backend constraints
- Don't import from other features — share common schemas via `src/lib/` or inline them
