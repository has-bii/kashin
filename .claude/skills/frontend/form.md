# Skill: Forms

## When to Use

When building any form with validation and API submission.

## File Locations

- Form hook: `src/features/{feature}/hooks/use-{resource}-form.ts`
- Schema: `src/features/{feature}/validations/schema.ts`
- Form component: `src/features/{feature}/components/{resource}-form.tsx`

## Pattern

1. Define Zod schema in `validations/schema.ts` (import from `zod/v4`)
2. Create a hook in `hooks/` that combines `useForm` + `useMutation`
3. Form component only renders fields — all logic lives in the hook

## Schema Template

```typescript
// src/features/{feature}/validations/schema.ts
import { z } from 'zod/v4'

export const {resource}Schema = z.object({
  name: z.string().min(1, 'Required').max(100, 'Max 100 characters'),
  // ...
})

export type {Resource}Dto = z.infer<typeof {resource}Schema>
```

## Hook Template (create + update in one hook)

```typescript
// src/features/{feature}/hooks/use-{resource}-form.ts
import { {Resource} } from '../types'
import { {Resource}Dto, {resource}Schema } from '../validations/schema'
import { api } from '@/lib/api'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

type Args =
  | { mode: 'create'; onSuccess?: () => void }
  | { mode: 'update'; prevData: {Resource} | null; onSuccess?: () => void }

const {resource}Api = async (mode: 'create' | 'update', input: {Resource}Dto, id?: string) => {
  if (mode === 'create') {
    const { data } = await api.post<{Resource}>('/{resource}', input)
    return data
  }
  const { data } = await api.put<{Resource}>(`/{resource}/${id}`, input)
  return data
}

export const use{Resource}Form = (args: Args) => {
  const queryClient = useQueryClient()
  const prevData = args.mode === 'update' ? args.prevData : null

  const form = useForm({
    defaultValues: {
      name: prevData?.name ?? '',
      // ...
    },
    validators: {
      onSubmit: {resource}Schema,
    },
    onSubmit: async ({ value }) => {
      if (args.mode === 'update' && !prevData) return
      await mutation.mutateAsync({ input: value, id: prevData?.id }, { onSuccess: args.onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: ({ input, id }: { input: {Resource}Dto; id?: string }) =>
      {resource}Api(args.mode, input, id),
    onSuccess: (data) => {
      const verb = args.mode === 'create' ? 'added' : 'updated'
      toast.success(`${data.name} has been ${verb}`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['{resource}s'] })
    },
    onError: (error) => {
      let message = 'Unexpected error has occurred'
      if (isAxiosError(error)) {
        switch (error.status) {
          case 409:
            message = '{Resource} already exists'
            break
        }
      }
      toast.error(message)
    },
  })

  return { form, mutation }
}
```

## Component Template

```tsx
'use client'

import { use{Resource}Form } from '../hooks/use-{resource}-form'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Loader2, Plus } from 'lucide-react'

export function {Resource}Form({ mode }: { mode: 'create' | 'update' }) {
  const { form } = use{Resource}Form({ mode })

  return (
    <>
      <form
        id="{resource}-form"
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}
      >
        <FieldGroup>
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </form>

      <form.Subscribe
        children={({ canSubmit, isDirty, isSubmitting }) => (
          <Button
            form="{resource}-form"
            type="submit"
            disabled={isSubmitting || !canSubmit || !isDirty}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
            {mode === 'create' ? 'Add' : 'Save'}
          </Button>
        )}
      />
    </>
  )
}
```

## Rules

- Import from `zod/v4` not `zod`
- Form library: `@tanstack/react-form` — NEVER use react-hook-form
- `validators: { onSubmit: schema }` — passes the Zod schema directly (no zodResolver)
- Error display: check `field.state.meta.isTouched && !field.state.meta.isValid`
- Use `<form.Subscribe>` for submit button to access `canSubmit`, `isDirty`, `isSubmitting`
- The hook returns `{ form, mutation }` — component only needs `form`
- Use `mutation.mutateAsync` inside `onSubmit` (not `mutate`) to properly propagate errors
