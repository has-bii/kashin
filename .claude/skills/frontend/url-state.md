---
name: url-state
description: Implementing filters, tabs, or pagination via URL using nuqs. Use when the user asks to add filters, shareable URLs, or any state that should survive a page refresh.
---

# Skill: URL State

## When to Use
When implementing filters, tabs, pagination, or any UI state that should be shareable via URL.

## File Locations
- URL state hooks: `frontend/src/features/{domain}/hooks/use-{domain}-filters.ts`
- Custom parsers: `frontend/src/lib/nuqs-parser.ts`

## Pattern
1. Define a hook that uses `useQueryState` or `useQueryStates` from `nuqs`
2. Use built-in parsers or custom ones from `@/lib/nuqs-parser`
3. Wrap calling components in `<Suspense>` in the page (nuqs requirement)

## Template — Single Filter
```typescript
// features/{domain}/hooks/use-get-{domain}-filter.ts
import { TransactionType } from '@/types/enums'
import { parseAsStringEnum, useQueryState } from 'nuqs'

export const useGet{Domain}Filter = () => {
  const [type, setType] = useQueryState(
    'type',
    parseAsStringEnum<TransactionType>(['expense', 'income'])
  )

  return { type, setType }
}
```

## Template — Multiple Filters
```typescript
// features/{domain}/hooks/use-{domain}-filters.ts
import { parseAsDate } from '@/lib/nuqs-parser'
import { TransactionType } from '@/types/enums'
import { endOfMonth, startOfMonth } from 'date-fns'
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'

export const use{Domain}Filters = () => {
  const [filters, setFilters] = useQueryStates(
    {
      type: parseAsStringEnum<TransactionType>(['expense', 'income']),
      search: parseAsString,
      page: parseAsInteger.withDefault(1),
      dateFrom: parseAsDate.withDefault(startOfMonth(new Date())),
      dateTo: parseAsDate.withDefault(endOfMonth(new Date())),
    },
    {
      shallow: false,   // triggers server re-render
      clearOnDefault: true,  // removes param from URL when at default
    }
  )

  return { filters, setFilters }
}
```

## Available Parsers
- `parseAsString` — string param
- `parseAsInteger` — integer param
- `parseAsStringEnum<T>(['a', 'b'])` — typed enum
- `parseAsDate` — custom date parser from `@/lib/nuqs-parser`
- `.withDefault(value)` — set default (clears param from URL when at default)
- `.withOptions({ shallow: false })` — trigger server re-render on change

## Usage in Component
```tsx
import { Suspense } from 'react'

// In page.tsx — always wrap nuqs consumers in Suspense
<Suspense>
  <{Domain}FilterBar />
</Suspense>
```

## Rules
- Import `nuqs` parsers from `nuqs` — never roll your own URL parsing
- Custom date/complex parsers go in `@/lib/nuqs-parser.ts`
- Always wrap nuqs-consuming components in `<Suspense>` at page level
- Use `clearOnDefault: true` so URLs stay clean
- Use `shallow: false` when filter changes should re-fetch server data
- Do NOT use `zustand`, `jotai`, or `useState` for shareable filter state — use nuqs
