# Skill: API Queries

## When to Use

When fetching data from the API.

## File Locations

- Query file: `src/features/{feature}/api/get-{resource}.query.ts`
- Always import the axios instance from `@/lib/api` — never raw axios

## Pattern

1. Define a private async API function (not exported)
2. Export a `get{Resource}QueryKey(params)` function
3. Export a `get{Resource}QueryOptions(params)` using `queryOptions()`
4. In components, call with `useSuspenseQuery(get{Resource}QueryOptions(params))`

## Template

```typescript
// src/features/{feature}/api/get-{resource}.query.ts
import { {Resource} } from '../types'
import { api } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

type Get{Resource}Params = {
  page?: number
  limit?: number
  // add filters as needed
}

const get{Resource} = async (params: Get{Resource}Params) => {
  const { data } = await api.get<{Resource}[]>('/{resource}', { params })
  return data
}

export const get{Resource}QueryKey = (params: Get{Resource}Params) => ['{resource}s', params]

export const get{Resource}QueryOptions = (params: Get{Resource}Params) => {
  return queryOptions({
    queryKey: get{Resource}QueryKey(params),
    queryFn: () => get{Resource}(params),
  })
}
```

## Usage in Component

```tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { get{Resource}QueryOptions } from '../api/get-{resource}.query'

export function {Resource}List() {
  const { data } = useSuspenseQuery(get{Resource}QueryOptions({ page: 1 }))
  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

## Rules

- Use `queryOptions()` not bare `{ queryKey, queryFn }` objects
- Use `useSuspenseQuery` not `useQuery` — wrap the component in `<Suspense>` at the page level
- Never add `staleTime`/`gcTime` — configured globally on the root QueryClient
- Query key: `['{resource}s', params]` — always include params so keys are param-specific
- Lazy-load components that use `useSuspenseQuery` via `dynamic()` with `ssr: false`
