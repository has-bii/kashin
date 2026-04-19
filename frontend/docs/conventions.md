---
title: Code Conventions
description: File naming, function naming, export patterns, feature module layout, TanStack Query/Form, and Zod patterns
tags: [conventions, naming, patterns, tanstack, zod]
---

# Code Conventions

## File Naming

All files use **kebab-case**:

| Type | Example |
|------|---------|
| Component | `transaction-form.tsx` |
| Hook | `use-transaction-form.ts` |
| Query file | `get-transactions.query.ts` |
| Mutation file | `delete-transaction.ts` |
| Types | `index.ts` (inside `types/`) |
| Zod schema | `schema.ts` (inside `validations/`) |
| Utility | `format-amount.ts` |

## Naming

| Thing | Convention | Export |
|-------|-----------|--------|
| React component | `PascalCase` | Default for pages; named for reusable |
| Custom hook | `camelCase` with `use` prefix | Named |
| API function | `camelCase` | Named |
| Utility function | `camelCase` | Named |
| DTO type | `PascalCase` + `Dto` suffix (`TransactionCreateDto`) | Named |
| Zod schema | `camelCase` + `Schema` suffix (`transactionSchema`) | Named |

## Feature Module Layout

Every feature lives in `src/features/<name>/`:

```
src/features/<name>/
├── api/            # Query functions and mutation functions
│   ├── get-<name>.query.ts
│   └── <action>-<name>.ts
├── components/     # React components
├── hooks/          # Custom hooks (useXxxForm, useXxxQuery)
├── types/
│   └── index.ts    # TypeScript interfaces
└── validations/
    └── schema.ts   # Zod schemas
```

## TanStack Query Patterns

### Query (read)

```ts
// api/get-transactions.query.ts
export const getTransactionsQueryKey = (params: Params) =>
  ["transactions", params] as const;

export const getTransactionsQueryOptions = (params: Params) =>
  queryOptions({
    queryKey: getTransactionsQueryKey(params),
    queryFn: () => getTransactions(params),
  });
```

Use `useSuspenseQuery` in components (not `useQuery`) so loading is handled by Suspense boundaries.

### Mutation (write)

Mutation functions live in `api/` as standalone async functions:

```ts
export const deleteTransactionApi = async (id: string) =>
  api.delete(`/transactions/${id}`).then(({ data }) => data);
```

Wrap in a hook in `hooks/`:

```ts
export const useTransactionDelete = () =>
  useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => toast.error("Failed to delete"),
  });
```

## TanStack Form Pattern

```ts
export const useTransactionForm = (onSuccess?: () => void) => {
  const mutation = useTransactionCreate();

  const form = useForm({
    defaultValues: { amount: 0, note: "" },
    validators: { onSubmit: transactionSchema },
    onSubmit: ({ value }) => mutation.mutate(value, { onSuccess }),
  });

  return { form, mutation };
};
```

In components, use `form.Field` render-prop:

```tsx
<form.Field name="amount">
  {(field) => (
    <div>
      <Input value={field.state.value} onChange={(e) => field.handleChange(+e.target.value)} />
      {field.state.meta.isTouched && !field.state.meta.isValid && (
        <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
      )}
    </div>
  )}
</form.Field>
```

## Zod Patterns

Import from `"zod/v4"`. Define schema in `validations/schema.ts`, export both the schema and inferred type:

```ts
import { z } from "zod/v4";

export const transactionSchema = z.object({
  amount: z.number().positive(),
  note: z.string().min(1).max(255),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().nullable(),
});

export type TransactionCreateDto = z.infer<typeof transactionSchema>;
export type TransactionUpdateDto = Partial<TransactionCreateDto>;
// or: z.infer<typeof transactionSchema.partial()>
```

Use `.nullable()` for optional foreign keys, `.partial()` for update DTOs.

## Axios Usage

```ts
// Typed responses via generics
const { data } = await api.get<Transaction[]>("/transactions");
const { data } = await api.post<Transaction>("/transactions", body);
```

`withCredentials: true` is set globally — never override it.
