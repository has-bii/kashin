---
name: feature-hooks
description: >
  Area skill for implementing the hooks layer of a kashin frontend feature.
  Loaded by implement-feature (not invoked directly). Covers useXxxForm,
  useXxxFilter, and useXxxContext patterns. In extended layout, useMutation
  hooks live in mutations/ instead. Follow this when creating files in
  src/features/<name>/hooks/.
user-invocable: false
---

# Feature Hooks Layer

Implement the `hooks/` directory. What goes here differs by layout:

| Layout | `hooks/` contains |
|--------|------------------|
| **Minimal** | `useXxxForm` (form + mutation wired), `useXxxDelete`, `useXxxFilter` |
| **Extended** | `useXxxContext`, `useXxxForm` (form only, mutation imported from `mutations/`), `useXxxFilter` |

In extended layout, `useMutation` hooks live in `mutations/index.ts` — not here.

## Context Hook (extended layout only)

A thin wrapper around `useContext` with a null guard:

```ts
// hooks/use-<feature>-context.ts
import { FeatureNameContext } from "../context/feature-name.context";
import React from "react";

export const useFeatureNameContext = () => {
  const context = React.useContext(FeatureNameContext);
  if (!context) throw new Error("useFeatureNameContext must be used within FeatureNameProvider");
  return context;
};
```

## Form Hook

```ts
// hooks/use-<feature>-form.ts
import { useUpsertFeatureNameMutation } from "../mutations";
import { featureNameSchema } from "../validations/schema";
import type { FeatureName } from "../types";

interface UseFeatureNameForm {
  prevData?: FeatureName | null;
  options?: { onSuccess?: () => void; onError?: () => void };
}

export const useFeatureNameForm = ({ prevData, options }: UseFeatureNameForm) => {
  const mutation = useUpsertFeatureNameMutation(prevData?.id);

  const form = useForm({
    defaultValues: { name: prevData?.name ?? "" },
    validators: { onSubmit: featureNameSchema },
    onSubmit: async ({ value, formApi }) => {
      await mutation.mutateAsync(value, options);
      formApi.reset();
    },
  });

  return { form, mutation };
};
```

In minimal layout, inline `useMutation` here instead of importing from `mutations/`.

## Filter Hook

```ts
// hooks/use-<feature>-filter.ts
import { parseAsStringEnum, useQueryState } from "nuqs";
import { TransactionType } from "@/types/enums";

export const useFeatureNameFilter = () => {
  const [type, setType] = useQueryState(
    "type",
    parseAsStringEnum<TransactionType>(["expense", "income"]),
  );
  return { type, setType };
};
```

## Action Hooks (minimal layout only)

For delete/toggle mutations that don't need a form — in minimal layout only:

```ts
export const useFeatureNameDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFeatureNameApi,
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["feature-names"] });
    },
    onError: () => toast.error("Failed to delete"),
  });
};
```

## File Naming

| Hook purpose | File name |
|-------------|-----------|
| Context wrapper | `use-<feature>-context.ts` |
| Create/update form | `use-<feature>-form.ts` |
| Filter (URL state) | `use-get-<feature>-filter.ts` |
| Delete (minimal only) | `use-<feature>-delete.ts` |

## Rules

- No JSX — components go in `components/`
- No raw `axios` calls — import from `api/`
- No Zod schemas — import from `validations/schema.ts`
- In extended layout: no `useMutation` here — those go in `mutations/`
