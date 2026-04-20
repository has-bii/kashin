---
name: feature-components
description: >
  Area skill for implementing the components layer of a kashin frontend feature.
  Loaded by implement-feature (not invoked directly). Covers React component
  conventions, form rendering via TanStack Form's Field render-prop, list/card
  patterns, dialog/drawer usage, and shadcn component integration.
  Follow this when creating files in src/features/<name>/components/.
user-invocable: false
---

# Feature Components Layer

Implement the `components/` directory. Components are pure UI — they consume hooks, render data, and emit user events. No direct API calls or mutation logic here.

## File Naming & Exports

- Files: `kebab-case.tsx`
- Components: `PascalCase` named exports (not default, unless it's a page)
- Add `"use client"` at the top of every component file (all feature components are client-side)

## Form Component Pattern

```tsx
"use client";

import { useFeatureNameForm } from "../hooks/use-feature-name-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

interface FeatureNameFormProps {
  onSuccess?: () => void;
}

export function FeatureNameForm({ onSuccess }: FeatureNameFormProps) {
  const { form, mutation } = useFeatureNameForm(onSuccess);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
            )}
          </FieldGroup>
        )}
      </form.Field>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
```

## List Component Pattern

```tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getFeatureNamesQueryOptions } from "../api/get-feature-names.query";

export function FeatureNameList() {
  const { data } = useSuspenseQuery(getFeatureNamesQueryOptions());

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <FeatureNameCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

Use `useSuspenseQuery` — wrap the list with a `<Suspense>` boundary in the page.

## Card Component Pattern

```tsx
export function FeatureNameCard({ item }: { item: FeatureName }) {
  const deleteMutation = useFeatureNameDelete();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>...</CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => deleteMutation.mutate(item.id)}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## Dialog Pattern (Create/Edit)

Wrap forms in `ResponsiveDialog` (renders as Dialog on desktop, Drawer on mobile):

```tsx
"use client";

import { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

export function CreateFeatureNameDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4 mr-2" /> Add
      </Button>
      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Add Feature Name</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <FeatureNameForm onSuccess={() => setOpen(false)} />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
}
```

## Rules

- Check `@src/components/ui` for available shadcn components before building custom UI
- Icons: Lucide React only (`import { IconName } from "lucide-react"`)
- Loading states: use `mutation.isPending` to disable buttons, not local state
- Empty states: use the `Empty` component from `@/components/ui/empty`
- No direct `axios` or `fetch` calls — always consume hooks
- No manual `useMemo`/`useCallback` — React Compiler handles memoization
