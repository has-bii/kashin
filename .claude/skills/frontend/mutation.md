# Skill: Mutations

## When to Use
When deleting data or performing non-form mutations (POST/DELETE without a form).
For form-based create/update, see `form.md` instead.

## File Locations
- Delete hook: `frontend/src/features/{domain}/hooks/use-delete-{resource}.ts`
- Other mutations: `frontend/src/features/{domain}/hooks/use-{action}-{resource}.ts`

## Template — Delete Mutation
```typescript
// features/{domain}/hooks/use-delete-{resource}.ts
import { {Resource} } from '../types'
import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const {resource}DeleteApi = async (id: string) => {
  const { data } = await api.delete<{Resource}>(`/{resource}/${id}`)
  return data
}

type Args = {
  onSuccess?: () => void
}

export const useDelete{Resource} = ({ onSuccess }: Args = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {resource}DeleteApi,
    onSuccess: (data) => {
      toast.success(`${data.name} has been deleted`)
      queryClient.invalidateQueries({ queryKey: ['{resource}'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to delete {resource}')
    },
  })
}
```

## Cache Invalidation Convention
- After create → invalidate: `['{resource}']`
- After update → invalidate: `['{resource}']`
- After delete → invalidate: `['{resource}']`
- Use broad key (no params) to bust all list variants

## Usage in Component
```tsx
const deleteResource = useDelete{Resource}({ onSuccess: closeDialog })

<Button
  variant="destructive"
  disabled={deleteResource.isPending}
  onClick={() => deleteResource.mutate(id)}
>
  {deleteResource.isPending ? <Loader2 className="animate-spin" /> : 'Delete'}
</Button>
```

## Rules
- One hook per action (`useDeleteCategory`, `useBulkDelete`, etc.)
- Always show toast on success and error via `sonner`
- Always invalidate the relevant query key on success
- Check `mutation.isPending` to disable buttons during execution
- Pass `onSuccess` callback to hook, not to `mutate()` call
