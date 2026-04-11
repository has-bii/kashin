# Skill: Component

## When to Use

When creating any new React component.

## File Locations

- Feature components: `src/features/{feature}/components/{component-name}.tsx`
- Shared/reusable: `src/components/{component-name}.tsx`
- shadcn primitives: `src/components/ui/` (do not touch)
- Pages: `src/app/{route}/page.tsx`

## Pattern

1. Add `'use client'` if using hooks or event handlers (omit for pure Server Components)
2. Define props type inline (not a separate file unless shared across features)
3. Use named export (default only for `page.tsx`, `layout.tsx`, `loading.tsx`)
4. Compose from `@/components/ui/` primitives and lucide-react icons

## Template — Client Component

```tsx
'use client'

import { Button } from '@/components/ui/button'

type {ComponentName}Props = {
  title: string
  onAction?: () => void
  children?: React.ReactNode
}

export function {ComponentName}({ title, onAction, children }: {ComponentName}Props) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
      {onAction && <Button onClick={onAction}>Action</Button>}
    </div>
  )
}
```

## Template — Server Component (no interactivity)

```tsx
type {ComponentName}Props = {
  data: SomeType
}

export function {ComponentName}({ data }: {ComponentName}Props) {
  return <div>{data.name}</div>
}
```

## Rules

- Named exports everywhere except Next.js reserved files (`page.tsx`, `layout.tsx`)
- `'use client'` only when needed — keep boundary as low as possible
- Never add `React.memo`, `useMemo`, or `useCallback` — React Compiler handles it
- Destructure props in function signature
- Files: `kebab-case.tsx`; components: `PascalCase`
- No business logic in components — extract to hooks in `hooks/`
- Import icons from `lucide-react`, merge classes via `cn()` from `@/lib/utils`
