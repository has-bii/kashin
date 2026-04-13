---
name: query-api
description: Fetching data from API endpoints using React Query. Use when the user asks to load data, fetch a list, display resource details, or wire up a GET request in a component.
---

# Skill: API Queries

## When to Use
When fetching data from an API endpoint (GET requests).

## File Locations
- Query factory: `frontend/src/features/{domain}/api/get-{resource}.query.ts`
- Types: `frontend/src/features/{domain}/types/index.ts`

## Pattern
1. Define private fetch function using `api` from `@/lib/api`
2. Export a `{resource}QueryKey` function for cache invalidation
3. Export a `{resource}QueryOptions` factory using `queryOptions()`
4. In components, use `useSuspenseQuery({resource}QueryOptions(params))`

## Template
```typescript
// features/{domain}/api/get-{resource}.query.ts
import { {Resource} } from '../types'
import { api } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

type Get{Resource}Input = {
  // filter params
}

const get{Resource} = async (params: Get{Resource}Input) => {
  const { data } = await api.get<{Resource}>('/{resource}', { params })
  return data
}

export const get{Resource}QueryKey = (params: Get{Resource}Input) =>
  ['{resource}', params]

export const get{Resource}QueryOptions = (params: Get{Resource}Input) =>
  queryOptions({
    queryKey: get{Resource}QueryKey(params),
    queryFn: () => get{Resource}(params),
  })
```

## Usage in Component
```tsx
'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { get{Resource}QueryOptions } from '../api/get-{resource}.query'

export function {Resource}List() {
  const { data } = useSuspenseQuery(get{Resource}QueryOptions({ /* params */ }))
  return <>{data.map(...)}</>
}
```

## Rules
- Always use `queryOptions()` factory — never inline `queryKey`/`queryFn` in hooks
- Export the query key separately for use in `invalidateQueries`
- Use `useSuspenseQuery` in components — wrap with `<Suspense>` and a skeleton fallback
- API function returns data directly (destructure `{ data }` from axios response)
- Import `api` from `@/lib/api` — never raw `axios`
- For auth-specific queries, use `authClient` from `@/lib/auth-client`
