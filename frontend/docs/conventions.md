---
title: Code Conventions
description: File naming, function naming, export patterns, feature module layout, TanStack Query/Form, and Zod patterns
tags: [conventions, naming, patterns, tanstack, zod]
---

# Code Conventions

## File Naming

All files use **kebab-case**:

| Type          | Example                             |
| ------------- | ----------------------------------- |
| Component     | `transaction-form.tsx`              |
| Hook          | `use-transaction-form.ts`           |
| Query file    | `get-transactions.query.ts`         |
| Mutation file | `delete-transaction.ts`             |
| Types         | `index.ts` (inside `types/`)        |
| Zod schema    | `schema.ts` (inside `validations/`) |
| Utility       | `format-amount.ts`                  |

## Naming

| Thing            | Convention                                           | Export                                |
| ---------------- | ---------------------------------------------------- | ------------------------------------- |
| React component  | `PascalCase`                                         | Default for pages; named for reusable |
| Custom hook      | `camelCase` with `use` prefix                        | Named                                 |
| API function     | `camelCase`                                          | Named                                 |
| Utility function | `camelCase`                                          | Named                                 |
| DTO type         | `PascalCase` + `Dto` suffix (`TransactionCreateDto`) | Named                                 |
| Zod schema       | `camelCase` + `Schema` suffix (`transactionSchema`)  | Named                                 |

## Feature Module Layout

### Minimal layout

For simple features (read-only or single dialog):

```
src/features/<name>/
├── api/            # Raw HTTP functions + queryOptions factories
│   ├── get-<name>.query.ts   # queryOptions + queryKey factory
│   └── <action>-<name>.ts   # standalone async mutation function
├── components/     # React components
├── hooks/          # useXxxForm, useXxxMutation, useXxxFilter
├── types/
│   └── index.ts    # TypeScript interfaces
└── validations/
    └── schema.ts   # Zod schemas
```

### Extended layout

For features with multiple dialogs (create, edit, delete) sharing state across sibling components:

```
src/features/<name>/
├── api/            # Raw HTTP functions ONLY (no hooks, no queryOptions)
│   └── index.ts
├── query/          # queryOptions + QUERY_KEY constant
│   └── index.ts
├── mutations/      # useMutation hooks (toast + invalidate live here)
│   └── index.ts
├── context/        # Context type interface + createContext call
│   └── <name>.context.ts
├── provider/       # Provider component with dialog open/selected state
│   └── <name>.provider.tsx
├── hooks/          # useXxxContext, useXxxForm, useXxxFilter
├── components/
├── types/
│   └── index.ts
└── validations/
    └── schema.ts
```

**When to use extended layout:** features with two or more dialogs sharing selected-item state across sibling components (e.g. create, edit, delete dialogs).

### Layer responsibilities (extended layout)

| Directory    | Contains                                           | Does NOT contain          |
| ------------ | -------------------------------------------------- | ------------------------- |
| `api/`       | Raw async HTTP functions                           | queryOptions, hooks       |
| `query/`     | `QUERY_KEY` constant, `getXxxQueryOptions(params)` | hooks, API calls          |
| `mutations/` | `useMutation` hooks with toast + invalidate        | raw API calls, form logic |
| `context/`   | `XxxContextType` interface + `createContext`       | state, handlers           |
| `provider/`  | `XxxProvider` component with `useState` + handlers | queries, mutations        |
| `hooks/`     | `useXxxContext`, `useXxxForm`, `useXxxFilter`      | `useMutation` hooks       |

## TanStack Query Patterns

### Query (read)

```ts
// query/index.ts (extended) or api/get-xxx.query.ts (minimal)
export const CATEGORIES_QUERY_KEY = "categories" as const

export const getCategoriesQueryOptions = (params: GetCategoriesParams) =>
  queryOptions({
    queryKey: [CATEGORIES_QUERY_KEY, params],
    queryFn: () => getCategoriesApi(params),
  })
```

Use `useSuspenseQuery` in components (not `useQuery`) so loading is handled by Suspense boundaries.

### Mutation (write)

**Minimal layout** — raw function in `api/`, hook in `hooks/`:

```ts
export const deleteTransactionApi = async (id: string) =>
  api.delete(`/transactions/${id}`).then(({ data }) => data)

export const useTransactionDelete = () =>
  useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () => {
      toast.success("Deleted")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => toast.error("Failed to delete"),
  })
```

**Extended layout** — raw function in `api/index.ts`, hook in `mutations/index.ts`:

```ts
// mutations/index.ts
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: (data) => {
      toast.success(`${data.name} category has been deleted`)
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to delete category"),
  })
}
```

## TanStack Form Pattern

```ts
export const useTransactionForm = (onSuccess?: () => void) => {
  const mutation = useTransactionCreate()

  const form = useForm({
    defaultValues: { amount: 0, note: "" },
    validators: { onSubmit: transactionSchema },
    onSubmit: ({ value }) => mutation.mutate(value, { onSuccess }),
  })

  return { form, mutation }
}
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
import { z } from "zod/v4"

export const transactionSchema = z.object({
  amount: z.number().positive(),
  note: z.string().min(1).max(255),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().nullable(),
})

export type TransactionCreateDto = z.infer<typeof transactionSchema>
export type TransactionUpdateDto = Partial<TransactionCreateDto>
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
