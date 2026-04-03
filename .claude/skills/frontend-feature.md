---
name: frontend-feature
description: Create a new frontend feature module (components, hooks, validations, api, types). Use when adding a new UI feature.
---

# Frontend Feature Development

Create a new feature at `frontend/src/features/<name>/` with co-located directories. Use `category` feature as the reference implementation.

## Directory structure

```
src/features/<name>/
  types/index.ts          — TypeScript interfaces for the resource
  validations/schema.ts   — Zod v4 schemas + inferred DTO types
  api/<name>.query.ts     — TanStack Query options + queryKey helpers
  hooks/use-<action>.ts   — TanStack React Form hooks with mutations
  components/             — React components (one per file)
```

## Step 1: `types/index.ts` — Resource types

```ts
export interface <Name> {
  id: string
  userId: string
  // ... fields matching backend model
  createdAt: string
  updatedAt: string
}
```

## Step 2: `validations/schema.ts` — Zod schemas

```ts
import { z } from "zod/v4"

export const <name>CreateSchema = z.object({
  // Define fields with validation
})

export const <name>UpdateSchema = <name>CreateSchema.partial()

export type <Name>CreateDto = z.infer<typeof <name>CreateSchema>
export type <Name>UpdateDto = z.infer<typeof <name>UpdateSchema>
```

## Step 3: `api/get-<name>.query.ts` — Query options

```ts
import { <Name> } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const get<Name>s = async () => {
  const { data } = await api.get<<Name>[]>("/<name>")
  return data
}

export const get<Name>sQueryKey = () => ["<name>s"]

export const get<Name>sQueryOptions = () => {
  return queryOptions({
    queryKey: get<Name>sQueryKey(),
    queryFn: () => get<Name>s(),
  })
}
```

**Key rules:**
- Use `api` from `@/lib/api` (Axios instance)
- Export queryKey separately for invalidation
- Do NOT add staleTime/gcTime — set globally on QueryClient

## Step 4: `hooks/use-<action>.ts` — Form + mutation

```ts
import { <Name>CreateDto, <name>CreateSchema } from "../validations/schema"
import { get<Name>sQueryKey } from "../api/get-<name>.query"
import { <Name> } from "../types"
import { api } from "@/lib/api"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

const <name>CreateApi = async (input: <Name>CreateDto) => {
  const { data } = await api.post<<Name>>("/<name>", input)
  return data
}

type Args = { onSuccess?: () => void }

export const use<Name>CreateForm = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: { /* ... */ },
    validators: { onSubmit: <name>CreateSchema! },
    onSubmit: async ({ value }) => await mutation.mutateAsync(value, { onSuccess }),
  })

  const mutation = useMutation({
    mutationFn: <name>CreateApi,
    onSuccess: (data) => {
      toast.success(`<Name> created successfully`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: get<Name>sQueryKey() })
    },
    onError: (error) => {
      let message = "Unexpected error has occurred"
      if (isAxiosError(error)) {
        switch (error.status) {
          case 409: message = "<Name> already exists"; break
          default: break
        }
      } else { message = error.message }
      toast.error(message)
    },
  })

  return { form, mutation }
}
```

**Key rules:**
- Do NOT use React.memo/useMemo/useCallback — React Compiler handles it
- Use `sonner` for toast notifications
- Use `isAxiosError` for error handling
- Invalidate queries on mutation success

## Step 5: Components

- Use shadcn/ui components from `@/components/ui/`
- Use `cn()` from `@/lib/utils` for class merging
- One component per file, named `<action>-form.tsx` or `<name>-card.tsx`

## Step 6: Route page

Add page at `src/app/<route>/page.tsx`.

## Step 7: Update progress

Append entry to `/CHANGELOG.md` with what was added.

## Checklist

- [ ] `types/index.ts` with resource interface
- [ ] `validations/schema.ts` with Zod schemas + DTO types
- [ ] `api/` with query options and exported queryKey
- [ ] `hooks/` with form + mutation hooks
- [ ] Components built with shadcn/ui
- [ ] Route page added
- [ ] CHANGELOG.md updated
