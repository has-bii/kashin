---
description: Generate frontend implementation pattern docs (component, query API, mutation, form, routing, state management, lazy loading, testing). Scans existing code or generates opinionated defaults for React Vite, Tanstack Router, or Next.js.
allowed-tools: Read, Glob, Grep, Bash(cat:*), Bash(ls:*), Bash(find:*)
---

# Generate Frontend Skills

You are generating implementation pattern docs (skills) for the frontend of this project. These skills tell AI coding agents exactly HOW to implement things — following the project's existing patterns or establishing new ones.

Skills go in `.claude/skills/frontend/`.

---

## STEP 0: Read Project Context

Before anything, read these files if they exist:

- `.claude/docs/tech-stack.md` — to know the frontend framework, styling, libraries
- `.claude/docs/project-structure.md` — to know where files go
- `.claude/docs/conventions.md` — to know naming rules
- `.claude/docs/dependencies.md` — to know which libraries to use

If these don't exist, tell the user to run `/generate-project-docs` first, then stop.

Store the frontend framework as `FRONTEND_FRAMEWORK` (react-vite / tanstack-router / nextjs).

---

## STEP 1: Detect or Decide Patterns

Check if the project has existing frontend source code:

- Look for components, pages, hooks in the source directory
- Check if there are at least 2-3 existing components or pages

### If existing code found:

For each skill scope, scan 2-3 existing examples to extract the pattern. Read the MINIMUM files needed.

Present findings per scope:

```
Here's what I found for [scope]:

[compact pattern description]
[one short code snippet showing the pattern]

Is this the pattern you want to follow? Or should I adjust?
```

Wait for confirmation before generating each skill.

### If new project (no existing code):

Tell the user:

```
This looks like a new project. I'll generate default patterns for [FRONTEND_FRAMEWORK].
These are opinionated starter patterns — you can adjust them after generation.

Want me to proceed with defaults, or do you want to decide each pattern interactively?
```

If they want defaults → use the fallback patterns below.
If they want interactive → ask per scope what they prefer.

---

## STEP 2: Generate Skills

Generate one `.md` file per scope in `.claude/skills/frontend/`. Each skill follows this format:

```markdown
# Skill: [Name]

## When to Use

[One line — when should the agent read this skill]

## File Locations

[Where relevant files go — paths with {placeholders}]

## Pattern

[Step-by-step recipe — what to do, in order]

## Template

[Code template with {placeholders} — copy-paste ready]

## Example

[One real/realistic example from this project]

## Rules

- [Hard rules — things to always/never do]
```

Keep each skill under 80 lines. The agent should be able to read it in <500 tokens.

---

## SKILL SCOPES

---

### 1. component.md — Component Patterns

**What to scan:** Look at 2-3 existing components. How are they structured? Props typing? Styling? File organization?

**Fallback patterns by framework:**

#### React + Vite / Tanstack Router

````markdown
# Skill: Component

## When to Use

When creating any new React component.

## File Locations

- Shared/reusable: `src/components/{component-name}/{ComponentName}.tsx`
- Feature-specific: `src/features/{feature}/components/{ComponentName}.tsx`
- Page-level: `src/pages/{page}/{ComponentName}.tsx` (or `src/routes/` for Tanstack Router)

## Pattern

1. Create component file with PascalCase name
2. Define props interface inline (or in same file if complex)
3. Use named export
4. Colocate styles if using CSS modules

## Template

```tsx
interface {ComponentName}Props {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function {ComponentName}({ title, onAction, children }: {ComponentName}Props) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```
````

## Rules

- Named exports, not default exports (except pages if required by router)
- Props interface in same file — only extract to separate file if shared across components
- Functional components only — no class components
- Destructure props in function signature
- Keep components under 150 lines — extract subcomponents if larger
- No business logic in components — extract to hooks or utils

````

#### Next.js
```markdown
# Skill: Component

## When to Use
When creating any new React component.

## File Locations
- Shared/reusable: `src/components/{component-name}/{ComponentName}.tsx`
- Feature-specific: `src/features/{feature}/components/{ComponentName}.tsx`
- Page-level: `app/{route}/_components/{ComponentName}.tsx`

## Pattern
1. Decide: Server Component or Client Component
2. Server Component (default) — no interactivity, no hooks, can async/await
3. Client Component — add `'use client'` directive at top, use hooks, event handlers

## Template — Server Component (default)
```tsx
interface {ComponentName}Props {
  id: string;
}

export async function {ComponentName}({ id }: {ComponentName}Props) {
  const data = await getData(id); // can fetch directly

  return (
    <div>
      <h2>{data.title}</h2>
    </div>
  );
}
````

## Template — Client Component

```tsx
'use client';

import { useState } from 'react';

interface {ComponentName}Props {
  initialValue: string;
  onSave: (value: string) => void;
}

export function {ComponentName}({ initialValue, onSave }: {ComponentName}Props) {
  const [value, setValue] = useState(initialValue);

  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  );
}
```

## Rules

- Server Components by default — only add `'use client'` when you need interactivity or hooks
- Named exports, not default exports (except page.tsx, layout.tsx, loading.tsx)
- Keep `'use client'` boundary as low as possible — wrap only the interactive part
- No `async` in Client Components

````

---

### 2. query-api.md — Fetching Data (Queries)

**What to scan:** Look for existing data-fetching hooks or patterns. React Query usage? SWR? Fetch in Server Components?

**Fallback patterns:**

#### React Query / TanStack Query (React Vite / Tanstack Router)
```markdown
# Skill: API Queries

## When to Use
When fetching data from an API endpoint.

## File Locations
- Query hooks: `src/hooks/queries/use-{resource}.ts`
- API functions: `src/api/{resource}.api.ts`
- Query keys: `src/api/query-keys.ts` (or colocated)

## Pattern
1. Define API function in `src/api/{resource}.api.ts`
2. Create query hook in `src/hooks/queries/use-{resource}.ts`
3. Use the hook in components

## Template
```typescript
// src/api/{resource}.api.ts
import { api } from '@/lib/api'; // use the project's API client

export async function get{Resource}s(params?: { page?: number; limit?: number }) {
  const { data } = await api.get('/{resource}', { params });
  return data;
}

export async function get{Resource}(id: string) {
  const { data } = await api.get(`/{resource}/${id}`);
  return data;
}

// src/hooks/queries/use-{resource}.ts
import { useQuery } from '@tanstack/react-query';
import { get{Resource}s, get{Resource} } from '@/api/{resource}.api';

export function use{Resource}s(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['{resource}', 'list', params],
    queryFn: () => get{Resource}s(params),
  });
}

export function use{Resource}(id: string) {
  return useQuery({
    queryKey: ['{resource}', 'detail', id],
    queryFn: () => get{Resource}(id),
    enabled: !!id,
  });
}
````

## Query Key Convention

- List: `['{resource}', 'list', params]`
- Detail: `['{resource}', 'detail', id]`
- Related: `['{resource}', id, '{relation}']`

## Rules

- API functions are pure — they return data, no React hooks
- Query hooks are thin wrappers — just `useQuery` with key + fn
- Always use `enabled` to prevent fetching with missing params
- Never fetch in event handlers — that's a mutation, use mutation.md
- Use the project's API client (check dependencies.md), not raw fetch

````

#### Next.js (Server Components + React Query hybrid)
```markdown
# Skill: API Queries

## When to Use
When fetching data from an API or database.

## Two Approaches

### Server Components (preferred for initial page data)
```tsx
// Fetch directly in Server Components — no React Query needed
export default async function UsersPage() {
  const users = await getUsers(); // direct DB or API call
  return <UserList users={users} />;
}
````

### React Query (for client-side interactivity, polling, pagination)

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";

export function UserSearch({ initialData }) {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["users", "search", search],
    queryFn: () => fetchUsers({ search }),
    initialData,
  });
  // ...
}
```

## File Locations

- Server data functions: `src/data/{resource}.ts`
- Client query hooks: `src/hooks/queries/use-{resource}.ts`
- API client functions: `src/api/{resource}.api.ts`

## Rules

- Server Components fetch data directly — no useQuery needed
- Use React Query only in Client Components for interactive data
- Pass `initialData` from Server Component to avoid loading flash
- Cache and revalidate server data with Next.js `revalidatePath` / `revalidateTag`

````

---

### 3. mutation.md — Mutating Data

**What to scan:** Look for existing mutation patterns — how are forms submitted? How is cache invalidated?

**Fallback:**

```markdown
# Skill: Mutations

## When to Use
When creating, updating, or deleting data (POST/PUT/PATCH/DELETE).

## File Locations
- Mutation hooks: `src/hooks/mutations/use-{action}-{resource}.ts`
- API functions: `src/api/{resource}.api.ts` (same file as queries)

## Template
```typescript
// src/api/{resource}.api.ts (add to existing file)
export async function create{Resource}(data: Create{Resource}Input) {
  const response = await api.post('/{resource}', data);
  return response.data;
}

export async function update{Resource}(id: string, data: Update{Resource}Input) {
  const response = await api.put(`/{resource}/${id}`, data);
  return response.data;
}

export async function delete{Resource}(id: string) {
  const response = await api.delete(`/{resource}/${id}`);
  return response.data;
}

// src/hooks/mutations/use-create-{resource}.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create{Resource} } from '@/api/{resource}.api';

export function useCreate{Resource}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: create{Resource},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{resource}', 'list'] });
    },
  });
}
````

## Cache Invalidation Convention

- After create → invalidate list: `['{resource}', 'list']`
- After update → invalidate list + detail: `['{resource}']` (broad)
- After delete → invalidate list: `['{resource}', 'list']`

## Usage in Component

```tsx
const createUser = useCreate{Resource}();

const handleSubmit = (data: FormData) => {
  createUser.mutate(data, {
    onSuccess: () => toast.success('Created!'),
    onError: (err) => toast.error(err.message),
  });
};
```

## Rules

- One mutation hook per action (useCreateUser, useUpdateUser, useDeleteUser)
- Always invalidate relevant queries on success
- Handle loading/error states: `mutation.isPending`, `mutation.isError`
- Use `onSuccess`/`onError` callbacks in the component for UI feedback (toast, redirect)
- Never call `.mutate()` inside useEffect

````

---

### 4. form.md — Form Handling

**What to scan:** Look for existing forms. What library? How is validation done? How are errors displayed?

**Fallback — adapt based on form library from dependencies.md:**

#### React Hook Form + Zod
```markdown
# Skill: Forms

## When to Use
When creating any form with validation.

## Pattern
1. Define zod schema (reuse from backend if shared)
2. Create form component with `useForm` + `zodResolver`
3. Handle submission with mutation hook
4. Display field errors inline

## Template
```tsx
'use client'; // if Next.js

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreate{Resource} } from '@/hooks/mutations/use-create-{resource}';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof formSchema>;

export function {Resource}Form() {
  const createResource = useCreate{Resource}();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = (data: FormValues) => {
    createResource.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name')} placeholder="Name" />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <button type="submit" disabled={isSubmitting || createResource.isPending}>
        {createResource.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
````

## Edit Form Pattern

```tsx
// For edit forms, pass initial data and use a different mutation
export function Edit{Resource}Form({ initialData }: { initialData: FormValues & { id: string } }) {
  const updateResource = useUpdate{Resource}();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: FormValues) => {
    updateResource.mutate({ id: initialData.id, ...data });
  };

  // ... same form JSX
}
```

## Rules

- Always use zodResolver — no manual validation
- Disable submit button during submission (`isSubmitting` or `mutation.isPending`)
- Display errors inline below each field
- Use `reset()` after successful create
- For edit forms, pass `defaultValues` from existing data
- Reuse zod schemas from backend when possible (shared package or copy)

````

---

### 5. routing.md — Adding Pages/Routes

**What to scan:** Look at existing route/page structure.

**Fallback by framework:**

#### React + Vite (React Router or Tanstack Router)
```markdown
# Skill: Routing

## When to Use
When adding new pages or route segments.

## File Locations (Tanstack Router)
- Route files: `src/routes/{path}.tsx`
- Layout routes: `src/routes/{path}.layout.tsx` (or `__root.tsx`)
- Route config: auto-generated by Tanstack Router plugin

## File Locations (React Router)
- Pages: `src/pages/{PageName}.tsx`
- Route config: `src/router.tsx` or `src/routes/index.tsx`

## Template (Tanstack Router)
```tsx
// src/routes/{path}.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/{path}')({
  component: {Page}Page,
  loader: async () => {
    // optional data loading
    return { data };
  },
});

function {Page}Page() {
  const data = Route.useLoaderData();
  return <div>{/* page content */}</div>;
}
````

## Template (React Router)

```tsx
// src/pages/{PageName}.tsx
export default function {PageName}Page() {
  return <div>{/* page content */}</div>;
}

// Register in src/router.tsx
{ path: '/{path}', element: <{PageName}Page /> }
```

## Rules

- One page component per route
- Page components handle layout and data orchestration — delegate UI to child components
- Use loaders for data fetching when available (Tanstack Router / React Router 6.4+)
- Lazy load heavy pages

````

#### Next.js
```markdown
# Skill: Routing

## When to Use
When adding new pages, layouts, or route segments.

## File Locations
- Page: `app/{path}/page.tsx`
- Layout: `app/{path}/layout.tsx`
- Loading: `app/{path}/loading.tsx`
- Error: `app/{path}/error.tsx`
- Route group: `app/({group})/{path}/page.tsx`

## Template
```tsx
// app/{path}/page.tsx
export default async function {Page}Page() {
  const data = await getData();
  return <div>{/* page content */}</div>;
}

// app/{path}/layout.tsx (if needed)
export default function {Page}Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>{/* shared nav */}</nav>
      {children}
    </div>
  );
}

// app/{path}/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
````

## Dynamic Routes

```
app/users/[id]/page.tsx → /users/123
app/blog/[...slug]/page.tsx → /blog/a/b/c
```

## Rules

- `page.tsx` is the only required file — layout, loading, error are optional
- Pages are Server Components by default
- Use route groups `({group})` for shared layouts without affecting URL
- Use `generateStaticParams` for static generation of dynamic routes
- Use `loading.tsx` for instant loading states

````

---

### 6. state.md — Client State Management

**What to scan:** Look for existing stores, context providers, state patterns.

**Fallback — adapt based on state library from dependencies.md:**

#### Zustand
```markdown
# Skill: Client State

## When to Use
When managing client-side state that is NOT server data (use query-api.md for server data).

## File Locations
- Stores: `src/stores/{name}.store.ts`

## Template
```typescript
// src/stores/{name}.store.ts
import { create } from 'zustand';

interface {Name}State {
  items: Item[];
  selectedId: string | null;
  setSelected: (id: string | null) => void;
  addItem: (item: Item) => void;
  reset: () => void;
}

export const use{Name}Store = create<{Name}State>((set) => ({
  items: [],
  selectedId: null,
  setSelected: (id) => set({ selectedId: id }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  reset: () => set({ items: [], selectedId: null }),
}));

// Usage in component:
// const selectedId = use{Name}Store((s) => s.selectedId);
// const setSelected = use{Name}Store((s) => s.setSelected);
````

## When to Use Zustand vs React Query

- **React Query**: server data (API responses, DB data) — things that exist on the server
- **Zustand**: UI state (selected tab, sidebar open, filters, draft content) — things that exist only in the browser

## Rules

- One store per domain/feature — not one global store
- Always use selectors: `useStore((s) => s.field)` — never `useStore()` without selector
- Keep stores flat — avoid deeply nested state
- No API calls in stores — that's React Query's job

````

#### Jotai
```markdown
# Skill: Client State

## When to Use
When managing client-side state that is NOT server data.

## File Locations
- Atoms: `src/atoms/{name}.atom.ts`

## Template
```typescript
// src/atoms/{name}.atom.ts
import { atom } from 'jotai';

export const selectedIdAtom = atom<string | null>(null);
export const sidebarOpenAtom = atom(false);

// Derived atom
export const selectedItemAtom = atom((get) => {
  const id = get(selectedIdAtom);
  const items = get(itemsAtom);
  return items.find((item) => item.id === id) ?? null;
});

// Usage in component:
// const [selectedId, setSelectedId] = useAtom(selectedIdAtom);
// const selectedItem = useAtomValue(selectedItemAtom); // read-only
````

## Rules

- Atoms are small and composable — one atom per piece of state
- Use derived atoms for computed state
- `useAtom` for read+write, `useAtomValue` for read-only, `useSetAtom` for write-only
- No API calls in atoms — that's React Query's job

````

---

### 7. lazy-loading.md — Code Splitting & Lazy Loading

**What to scan:** Look for existing `React.lazy()`, dynamic imports, or Suspense boundaries.

**Fallback:**

```markdown
# Skill: Lazy Loading

## When to Use
When a component is heavy (charts, editors, modals) or only needed conditionally.

## Pattern — Route-based Splitting

### React Vite / Tanstack Router
```tsx
// Tanstack Router handles this automatically with file-based routing
// For manual lazy routes:
const LazyPage = React.lazy(() => import('./pages/HeavyPage'));
````

### Next.js

```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // disable SSR for browser-only components
});
```

## Pattern — Component-based Splitting

```tsx
import { lazy, Suspense } from "react";

const RichEditor = lazy(() => import("@/components/RichEditor"));

export function EditorPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <RichEditor />
    </Suspense>
  );
}
```

## When to Lazy Load

- Large third-party components (chart libraries, rich text editors, code editors)
- Modals and dialogs (not visible on initial render)
- Below-the-fold content
- Admin-only features

## When NOT to Lazy Load

- Small components (the overhead of splitting isn't worth it)
- Above-the-fold content (causes layout shift)
- Components used on every page

## Rules

- Always provide a `fallback` / `loading` component with Suspense
- Use `ssr: false` in Next.js for browser-only libraries (e.g., chart.js, Monaco editor)
- Lazy load at the route level first — component level only for heavy items

````

---

### 8. testing.md — Frontend Testing

**What to scan:** Look at existing test files. What runner? How are components rendered? How are API calls mocked?

**Fallback:**

```markdown
# Skill: Frontend Testing

## When to Use
When writing component tests, hook tests, or integration tests.

## File Locations
- Component tests: colocated as `{ComponentName}.test.tsx`
- Hook tests: colocated as `use-{name}.test.ts`
- E2E tests: `e2e/` or `tests/` at project root

## Template — Component Test
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; // or jest
import { {ComponentName} } from './{ComponentName}';

describe('{ComponentName}', () => {
  it('renders title', () => {
    render(<{ComponentName} title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const onAction = vi.fn();
    render(<{ComponentName} title="Hello" onAction={onAction} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalledOnce();
  });
});
````

## Template — Hook Test (with React Query)

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { use{Resource}s } from './use-{resource}s';

const wrapper = ({ children }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

it('fetches data', async () => {
  const { result } = renderHook(() => use{Resource}s(), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

## Rules

- Test user behavior, not implementation details
- Use `screen.getByRole`, `getByText`, `getByLabelText` — not `getByTestId` (last resort)
- Mock API calls, not components
- Each test should be independent — no shared mutable state
- Wrap components that use React Query/Router in appropriate providers

````

---

## STEP 3: Update CLAUDE.md

After generating all skills, update the skills section in `CLAUDE.md`:

```markdown
## Skills — Frontend

Before implementing frontend features, read the relevant skill in `.claude/skills/frontend/`:

| Skill | When to Read |
|-------|-------------|
| `component.md` | Creating new React components |
| `query-api.md` | Fetching data from API |
| `mutation.md` | Creating, updating, or deleting data |
| `form.md` | Building forms with validation |
| `routing.md` | Adding new pages or routes |
| `state.md` | Managing client-side state |
| `lazy-loading.md` | Code splitting and lazy loading components |
| `testing.md` | Writing frontend tests |
````

Tell the user:

```
Done! Frontend skills generated in .claude/skills/frontend/
CLAUDE.md updated with skill references.

Generated skills:
- component.md
- query-api.md
- mutation.md
- form.md
- routing.md
- state.md
- lazy-loading.md
- testing.md

Review each file and adjust patterns to match your exact preferences.
```
