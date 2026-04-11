# Skill: Routing

## When to Use

When adding new pages, layouts, or route segments.

## File Locations

- Page: `src/app/{route}/page.tsx`
- Layout: `src/app/{route}/layout.tsx`
- Loading: `src/app/{route}/loading.tsx`
- Route group (shared layout, no URL segment): `src/app/({group})/{route}/page.tsx`

## Page Template

```tsx
'use client'  // add if using state/hooks; omit for pure server pages

import { SiteHeader } from '@/components/sidebar/site-header'
import {
  MainPage,
  MainPageHeader,
  MainPageTitle,
  MainPageDescripton,
} from '@/components/sidebar/main-page'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import {Feature}Skeleton from '@/features/{feature}/components/{feature}-skeleton'

// Lazy-load feature components that use useSuspenseQuery
const {Feature}List = dynamic(
  () => import('@/features/{feature}/components/{feature}-list'),
  { ssr: false, loading: () => <{Feature}Skeleton /> }
)

export default function {Page}Page() {
  return (
    <>
      <SiteHeader label="{Page}" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>{Page Title}</MainPageTitle>
            <MainPageDescripton>Short description.</MainPageDescripton>
          </div>
        </MainPageHeader>

        <Suspense>
          <{Feature}List />
        </Suspense>
      </MainPage>
    </>
  )
}
```

## Dynamic Routes

```
src/app/dashboard/(main)/[id]/page.tsx  →  /dashboard/123
src/app/dashboard/(main)/[...slug]/page.tsx  →  /dashboard/a/b/c
```

## Rules

- Default export only for `page.tsx`, `layout.tsx`, `loading.tsx`
- Add `'use client'` when the page itself needs hooks/state (e.g. dialog open state)
- Lazy-load feature components that use `useSuspenseQuery` — they need `ssr: false`
- Wrap lazy-loaded components in `<Suspense>` at page level
- Use route groups `({group})` to share layouts without adding URL segments
- Page handles layout composition only — delegate all business logic to feature components
