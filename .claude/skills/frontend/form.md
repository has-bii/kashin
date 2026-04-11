# Skill: Forms

## When to Use
When building create or edit forms that call the API.

## File Locations
- Form hook: `frontend/src/features/{domain}/hooks/use-{domain}-form.ts`
- Zod schema: `frontend/src/features/{domain}/validations/schema.ts`
- Form component: `frontend/src/features/{domain}/components/{domain}-form.tsx`

## Pattern
1. Define Zod schema + infer `{Resource}Dto` type in `validations/schema.ts`
2. In hook: combine `useForm` (TanStack Form) + `useMutation` (React Query)
3. Pass zod schema to `validators: { onSubmit: schema }`
4. Call `mutation.mutateAsync()` inside `onSubmit`
5. In component: use `form.Field` render-prop for each field, `form.Subscribe` for submit button

## Validation Schema
```typescript
// features/{domain}/validations/schema.ts
import { z } from 'zod/v4'

export const {resource}Schema = z.object({
  name: z.string().min(1, 'Required').max(100),
  // ...
})

export type {Resource}Dto = z.infer<typeof {resource}Schema>
```

## Form Hook Template
```typescript
// features/{domain}/hooks/use-{domain}-form.ts
import { {resource}Schema, {Resource}Dto } from '../validations/schema'
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
      // map other fields...
    },
    validators: { onSubmit: {resource}Schema },
    onSubmit: async ({ value }) => {
      if (args.mode === 'update' && !prevData) return
      await mutation.mutateAsync({ input: value, id: prevData?.id }, { onSuccess: args.onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: ({ input, id }: { input: {Resource}Dto; id?: string }) =>
      {resource}Api(args.mode, input, id),
    onSuccess: () => {
      const verb = args.mode === 'create' ? 'created' : 'updated'
      toast.success(`{Resource} ${verb} successfully`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['{resource}'] })
    },
    onError: (error) => {
      if (isAxiosError(error) && error.status === 409) {
        toast.error('{Resource} already exists')
      } else {
        toast.error('Unexpected error occurred')
      }
    },
  })

  return { form, mutation }
}
```

## Form Component Template
```tsx
// features/{domain}/components/{domain}-form.tsx
'use client'

import { use{Resource}Form } from '../hooks/use-{domain}-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, SaveIcon } from 'lucide-react'

type Props = { mode: 'create' } | { mode: 'update'; data: {Resource} | null }

export function {Resource}Form(props: Props) {
  const { form } = use{Resource}Form({ ...props, onSuccess: closeDialog })

  return (
    <form id="{resource}-form" onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
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

      <form.Subscribe
        children={({ canSubmit, isDirty, isSubmitting }) => (
          <Button
            form="{resource}-form"
            type="submit"
            disabled={isSubmitting || !canSubmit || !isDirty}
          >
            {props.mode === 'create' ? (
              <>Add {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}</>
            ) : (
              <>Save {isSubmitting ? <Loader2 className="animate-spin" /> : <SaveIcon />}</>
            )}
          </Button>
        )}
      />
    </form>
  )
}
```

## Rules
- Use `zod/v4` — import from `'zod/v4'`, not `'zod'`
- Form hook combines `useForm` + `useMutation` — do not split them
- Use `form.Field` render-prop with `children` — never `register()`
- Error check: `field.state.meta.isTouched && !field.state.meta.isValid`
- Submit button reads state via `form.Subscribe` — access `canSubmit`, `isDirty`, `isSubmitting`
- Disable submit when `!canSubmit || !isDirty || isSubmitting`
- Call `mutateAsync` (not `mutate`) so `onSubmit` can await it
- Always `toast.success` on success, `toast.error` on error via `sonner`
