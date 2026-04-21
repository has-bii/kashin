---
name: feature-api
description: >
  Area skill for implementing the API layer of a kashin frontend feature.
  Loaded by implement-feature (not invoked directly). Covers raw HTTP functions
  and (in minimal layout) queryOptions factories. Follow this skill when
  creating files in src/features/<name>/api/.
user-invocable: false
---

# Feature API Layer

The `api/` directory contains raw async HTTP functions. What else lives here depends on the layout:

| Layout | `api/` contains |
|--------|----------------|
| **Minimal** | Raw HTTP functions + queryOptions factories (`get-<name>.query.ts`) |
| **Extended** | Raw HTTP functions ONLY — queryOptions go in `query/`, mutation hooks go in `mutations/` |

## Raw HTTP Functions

These are plain async functions — no hooks, no queryOptions, no toast:

```ts
// api/index.ts (extended) or api/<action>-<feature>.ts (minimal)
import { api } from "@/lib/api";
import type { Category, GetCategoriesParams } from "../types";
import type { CategoryDto } from "../validations/schema";

export const getCategoriesApi = async (params: GetCategoriesParams) => {
  const { data } = await api.get<Category[]>("/category", { params });
  return data;
};

export const createCategoryApi = async (input: CategoryDto) => {
  const { data } = await api.post<Category>("/category", input);
  return data;
};

export const updateCategoryApi = async (id: string, input: CategoryDto) => {
  const { data } = await api.put<Category>(`/category/${id}`, input);
  return data;
};

export const deleteCategoryApi = async (id: string) => {
  const { data } = await api.delete<Category>(`/category/${id}`);
  return data;
};
```

Naming: `<action><FeatureName>Api` (camelCase, `Api` suffix).

## Query Files (minimal layout only)

File naming: `get-<feature>.query.ts`

```ts
import { queryOptions } from "@tanstack/react-query";
import { getFeatureNamesApi } from "./get-feature-names";
import type { Params } from "../types";

export const getFeatureNamesQueryKey = (params?: Params) =>
  ["feature-names", params] as const;

export const getFeatureNamesQueryOptions = (params?: Params) =>
  queryOptions({
    queryKey: getFeatureNamesQueryKey(params),
    queryFn: () => getFeatureNamesApi(params),
  });
```

In extended layout, skip this — create `query/index.ts` instead (see `feature-query` skill).

## Rules

- Always type Axios responses via generic: `api.get<ReturnType>()`
- Always destructure `{ data }` — never return the full Axios response
- No React hooks (`use*`) — hooks go in `hooks/` or `mutations/`
- No toast calls, no query invalidation — those belong in `mutations/` or `hooks/`
- No Zod schemas — import from `../validations/schema`
