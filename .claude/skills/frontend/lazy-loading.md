# Skill: Lazy Loading

## When to Use

When a component uses `useSuspenseQuery` (required), or is heavy and conditionally rendered.

## Pattern

Use Next.js `dynamic()` for all components that use `useSuspenseQuery`. This is required because Suspense + SSR breaks without it.

## Template

```tsx
// In page.tsx
import dynamic from 'next/dynamic'
import {Feature}Skeleton from '@/features/{feature}/components/{feature}-skeleton'

const {Feature}List = dynamic(
  () => import('@/features/{feature}/components/{feature}-list'),
  {
    ssr: false,
    loading: () => <{Feature}Skeleton />,
  }
)

// Usage
<Suspense>
  <{Feature}List />
</Suspense>
```

## When to Use `ssr: false`

- Component uses `useSuspenseQuery` — always
- Component uses browser-only APIs (window, localStorage)
- Component uses chart libraries (recharts) or DnD

## When NOT to Lazy Load

- Small UI components (buttons, badges, cards without queries)
- Components used on every page
- Above-the-fold content that affects LCP

## Rules

- Always provide a `loading` skeleton — never leave it undefined
- Wrap lazy components in `<Suspense>` at page level (not in the component itself)
- Skeleton component lives in the same feature folder: `{feature}-skeleton.tsx`
- Never wrap a component in dynamic() inside another component — only in page files
