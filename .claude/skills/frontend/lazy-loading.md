---
name: lazy-loading
description: Code-splitting data-fetching components or heavy third-party widgets with dynamic(). Use when the user asks to lazy load a component, add a skeleton, or improve initial page load.
---

# Skill: Lazy Loading

## When to Use
When a component fetches data (uses `useSuspenseQuery`) or is a heavy third-party widget.

## Pattern — Feature Lists (Most Common)
Data-fetching components should be lazy-loaded with `dynamic()` + a skeleton fallback.

```tsx
// In page.tsx
import dynamic from 'next/dynamic'
import { {Domain}Skeleton } from '@/features/{domain}/components/{domain}-skeleton'

const {Domain}List = dynamic(
  () => import('@/features/{domain}/components/{domain}-list'),
  {
    ssr: false,
    loading: () => <{Domain}Skeleton />,
  }
)

// Use directly — no Suspense wrapper needed (dynamic handles it)
<{Domain}List />
```

## Pattern — Heavy Third-Party (Charts, Editors)
```tsx
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/my-chart'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" />,
})
```

## Pattern — Suspense + nuqs Filters (Required)
Components that use `nuqs` must be wrapped in `<Suspense>`:
```tsx
import { Suspense } from 'react'

<Suspense>
  <{Domain}FilterBar />  {/* uses useQueryState */}
</Suspense>
```

## Skeleton Template
```tsx
// features/{domain}/components/{domain}-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function {Domain}Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-4xl" />
      ))}
    </div>
  )
}
```

## When to Lazy Load
- Any component that calls `useSuspenseQuery` — always lazy load with `dynamic()`
- Chart components (recharts)
- Any component that only renders client-side

## When NOT to Lazy Load
- Static UI components (buttons, cards, headers)
- Small utility components
- Components already inside a lazy-loaded parent

## Rules
- Use `ssr: false` for all components that use React Query hooks
- Always provide a `loading` skeleton — never show nothing
- `dynamic()` is the Next.js equivalent of `React.lazy()` — prefer `dynamic()`
- Skeleton components use default export (dynamic import requires it)
