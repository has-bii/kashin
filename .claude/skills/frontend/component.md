---
name: component
description: Creating any new React component or feature UI element. Use when the user asks to build a component, UI element, card, button group, or any visual piece of the frontend.
---

# Skill: Component

## When to Use
When creating any new React component or feature UI element.

## File Locations
- Feature component: `frontend/src/features/{domain}/components/{component-name}.tsx`
- Shared/reusable: `frontend/src/components/{component-name}.tsx`
- shadcn primitives: `frontend/src/components/ui/` — added via shadcn CLI only

## Pattern
1. Decide: Server Component (default) or Client Component
2. If interactive (state, event handlers, hooks) → add `'use client'` at top
3. Define `type Props = { ... }` inline (same file)
4. Use named export (except `page.tsx`, `layout.tsx` — framework default exports)
5. Style with Tailwind + `cn()` from `@/lib/utils`; use shadcn/ui primitives from `@/components/ui/`

## Template — Client Component
```tsx
'use client'

import { cn } from '@/lib/utils'

type Props = {
  title: string
  onAction?: () => void
  className?: string
}

export function {ComponentName}({ title, onAction, className }: Props) {
  return (
    <div className={cn('...', className)}>
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  )
}
```

## Template — Server Component (no interactivity)
```tsx
type Props = {
  id: string
}

export function {ComponentName}({ id }: Props) {
  return <div>...</div>
}
```

## Rules
- Named exports only — default export only for `page.tsx` / `layout.tsx`
- `type Props` inline in the same file; never a separate `props.ts`
- `'use client'` only when needed — push the boundary as low as possible
- Never `React.memo`, `useMemo`, `useCallback` — React Compiler handles this
- Use `cn()` from `@/lib/utils` — never `clsx()` or `twMerge()` directly
- Icons from `lucide-react` only
- File name: `kebab-case.tsx`
