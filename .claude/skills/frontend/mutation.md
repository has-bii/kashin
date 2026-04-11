# Skill: Mutations

## When to Use

When creating, updating, or deleting data (POST/PUT/PATCH/DELETE) without a form.

## File Locations

- Mutation hook: `src/features/{feature}/hooks/use-{action}-{resource}.ts`

## Pattern

1. Define a private API function in the same file
2. Export a hook that wraps `useMutation`
3. On success: show toast + `invalidateQueries`
4. On error: show toast with specific messages per status code using `isAxiosError`

## Template

```typescript
// src/features/{feature}/hooks/use-delete-{resource}.ts
import { {Resource} } from '../types'
import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

const delete{Resource}Api = async (id: string) => {
  const { data } = await api.delete<{Resource}>(`/{resource}/${id}`)
  return data
}

type Args = {
  onSuccess?: () => void
}

export const useDelete{Resource} = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: delete{Resource}Api,
    onSuccess: (data) => {
      toast.success(`${data.name} has been deleted`)
      queryClient.invalidateQueries({ queryKey: ['{resource}s'] })
      onSuccess?.()
    },
    onError: (error) => {
      let message = 'Unexpected error has occurred'
      if (isAxiosError(error)) {
        switch (error.status) {
          case 404:
            message = '{Resource} not found'
            break
        }
      }
      toast.error(message)
    },
  })
}
```

## Cache Invalidation Convention

- After create/update/delete → invalidate the list key: `['{resource}s']`
- For targeted invalidation: `['{resource}s', params]`

## Rules

- One hook per action (`useDelete{Resource}`, `useArchive{Resource}`)
- Accept `onSuccess` callback for caller-defined side effects (close dialog, navigate)
- Always use `isAxiosError` to check error type before accessing `.status`
- For forms with mutations, use `form.md` instead — colocate form + mutation in one hook
