---
name: feature-query
description: >
  Area skill for implementing the query layer of a kashin frontend feature
  (extended layout only). Covers the QUERY_KEY constant and getXxxQueryOptions
  factory. Loaded by implement-feature when extended layout is chosen. Follow
  this when creating src/features/<name>/query/index.ts.
user-invocable: false
---

# Feature Query Layer (Extended Layout)

Implement `query/index.ts`. This file owns the query key and queryOptions factory for the feature. It has no hooks, no mutations, no direct API calls.

## Pattern

```ts
// query/index.ts
import { getCategoriesApi } from "../api";
import { GetCategoriesParams } from "../types";
import { queryOptions } from "@tanstack/react-query";

export const CATEGORIES_QUERY_KEY = "categories" as const

export const getCategoriesQueryOptions = (params: GetCategoriesParams) =>
  queryOptions({
    queryKey: [CATEGORIES_QUERY_KEY, params],
    queryFn: () => getCategoriesApi(params),
  })
```

Adapt `CATEGORIES_QUERY_KEY` → `<FEATURE_NAME_UPPER>_QUERY_KEY` (e.g. `BUDGETS_QUERY_KEY`).
Adapt `getCategoriesQueryOptions` → `get<FeatureName>QueryOptions`.

## Rules

- Export the `QUERY_KEY` as a `const` string — mutations import it to invalidate
- Export `get<FeatureName>QueryOptions(params)` — components call this with `useSuspenseQuery`
- Import the raw API function from `../api` — never call `axios` directly here
- No React hooks, no `useMutation`, no toast calls
- One file: `query/index.ts`

## Usage in components

```ts
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "../query";

const { data } = useSuspenseQuery(getCategoriesQueryOptions({ type }));
```

Always `useSuspenseQuery`, never `useQuery` — loading is handled by Suspense boundaries.
