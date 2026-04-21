---
name: feature-mutations
description: >
  Area skill for implementing the mutations layer of a kashin frontend feature
  (extended layout only). Covers useMutation hooks with toast + invalidate.
  Loaded by implement-feature when extended layout is chosen. Follow this when
  creating src/features/<name>/mutations/index.ts.
user-invocable: false
---

# Feature Mutations Layer (Extended Layout)

Implement `mutations/index.ts`. All `useMutation` hooks live here — they handle toast feedback and query invalidation. Components and form hooks import from here.

## Upsert Pattern (create + update in one hook)

```ts
// mutations/index.ts
import { createCategoryApi, updateCategoryApi } from "../api";
import { CATEGORIES_QUERY_KEY } from "../query";
import { CategoryDto } from "../validations/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpsertCategoryMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CategoryDto) => {
      if (id) return updateCategoryApi(id, input);
      return createCategoryApi(input);
    },
    onSuccess: (data) => {
      toast.success(`${data.name} category has been ${id ? "updated" : "created"}`);
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
    onError: (e) => {
      toast.error(e.message || "Unexpected error occurred");
    },
  });
};
```

## Delete Pattern

```ts
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: (data) => {
      toast.success(`${data.name} category has been deleted`);
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to delete category");
    },
  });
};
```

## Rules

- Import raw API functions from `../api`
- Import `QUERY_KEY` from `../query` — never hardcode the query key string here
- Always `invalidateQueries` in `onSuccess`
- Always `toast.error` in `onError` — use `e.message` with a fallback string
- One file: `mutations/index.ts`
- Naming: `use<Action><FeatureName>Mutation` (e.g. `useUpsertCategoryMutation`, `useDeleteCategoryMutation`)

## Per-call callbacks

Mutations accept per-call `onSuccess`/`onError` via `mutateAsync(value, options)`. The mutation-level handlers (toast, invalidate) always run; per-call callbacks run in addition — use them to close dialogs:

```ts
// in a form hook
await mutation.mutateAsync(value, { onSuccess: closeDialog });
```
