# Skill: Routing

## When to Use
When adding new pages, layouts, or route segments.

## File Locations
- Page: `frontend/src/app/{path}/page.tsx`
- Dashboard page: `frontend/src/app/dashboard/(main)/{path}/page.tsx`
- Layout: `frontend/src/app/{path}/layout.tsx`
- Feature components: `frontend/src/features/{domain}/components/`

## Page Template
```tsx
// app/dashboard/(main)/{path}/page.tsx
'use client' // add only if page manages interactive state

import { SiteHeader } from '@/components/sidebar/site-header'
import {
  MainPage,
  MainPageHeader,
  MainPageTitle,
  MainPageDescripton,
} from '@/components/sidebar/main-page'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { {Domain}Skeleton } from '@/features/{domain}/components/{domain}-skeleton'

const {Domain}List = dynamic(
  () => import('@/features/{domain}/components/{domain}-list'),
  { ssr: false, loading: () => <{Domain}Skeleton /> }
)

export default function {Domain}Page() {
  return (
    <>
      <SiteHeader label="{Domain}" />
      <MainPage>
        <MainPageHeader>
          <div className="space-y-2">
            <MainPageTitle>{Domain}</MainPageTitle>
            <MainPageDescripton>Short description here.</MainPageDescripton>
          </div>
        </MainPageHeader>

        <Suspense>
          {/* filter components that use nuqs */}
        </Suspense>

        <{Domain}List />
      </MainPage>
    </>
  )
}
```

## Route Groups
- `(main)` — dashboard pages with shared sidebar layout
- `auth` — unauthenticated pages (login, register)
- Use route groups for shared layouts without affecting URL

## Rules
- `page.tsx` uses default export (Next.js requirement)
- All feature components use named exports
- Add `'use client'` to pages that manage dialog/modal state with `useState`
- Lazy-load data-heavy feature lists with `dynamic()` + `ssr: false`
- Wrap nuqs filter components in `<Suspense>` (required by nuqs)
- Use `SiteHeader`, `MainPage`, `MainPageHeader` for consistent dashboard layout
