# Skill: URL State

## When to Use

When filter state, pagination, or search needs to live in the URL (shareable, browser-back aware).

## File Locations

- Filters hook: `src/features/{feature}/hooks/use-{feature}-filters.ts`
- Custom parsers: `src/lib/nuqs-parser.ts`

## Pattern

Use `nuqs` with `useQueryStates` for multi-param URL state. Import parsers from `@/lib/nuqs-parser` for custom types (e.g. dates).

## Template

```typescript
// src/features/{feature}/hooks/use-{feature}-filters.ts
import { parseAsDate } from '@/lib/nuqs-parser'
import { endOfMonth, startOfMonth } from 'date-fns'
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'

type FilterEnum = 'value1' | 'value2'

export const use{Feature}Filters = () => {
  const [filters, setFilters] = useQueryStates(
    {
      type: parseAsStringEnum<FilterEnum>(['value1', 'value2']),
      search: parseAsString,
      dateFrom: parseAsDate.withDefault(startOfMonth(new Date())),
      dateTo: parseAsDate.withDefault(endOfMonth(new Date())),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,     // triggers server re-render on change
      clearOnDefault: true, // keeps URL clean — omits params at default value
    },
  )

  return { filters, setFilters }
}
```

## Usage

```tsx
const { filters, setFilters } = use{Feature}Filters()

// Read
const { type, search, page } = filters

// Write (partial update — merges with existing)
setFilters({ type: 'value1', page: 1 })

// Reset one filter
setFilters({ search: null })
```

## Parser Reference

| Parser | Type | From |
|--------|------|------|
| `parseAsString` | `string \| null` | nuqs |
| `parseAsInteger` | `number \| null` | nuqs |
| `parseAsBoolean` | `boolean \| null` | nuqs |
| `parseAsStringEnum<T>([...])` | `T \| null` | nuqs |
| `parseAsDate` | `Date \| null` | `@/lib/nuqs-parser` |

## Rules

- Always set `shallow: false` when filters affect server-rendered data
- Always set `clearOnDefault: true` to keep URLs clean
- Use `parseAsDate` from `@/lib/nuqs-parser` for date values — not nuqs built-in
- Wrap the relevant page/layout in `<NuqsAdapter>` (already done in root layout — check before adding)
- Filters hook belongs in `features/{feature}/hooks/` not in global `hooks/`
