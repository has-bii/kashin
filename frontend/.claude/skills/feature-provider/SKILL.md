---
name: feature-provider
description: >
  Area skill for implementing the provider layer of a kashin frontend feature
  (extended layout only). Manages dialog open/selected state and exposes
  handlers via context. Loaded by implement-feature when extended layout is
  chosen. Follow this when creating src/features/<name>/provider/<name>.provider.tsx.
user-invocable: false
---

# Feature Provider Layer (Extended Layout)

Implement `provider/<feature-name>.provider.tsx`. This component owns all dialog state and provides it to the tree via context.

## Pattern

```tsx
// provider/category.provider.tsx
import { CategoryContext, CategoryContextType } from "../context/category.context";
import { Category } from "../types";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export function CategoryProvider({ children }: Props) {
  /* Create / Update */
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const dialogMode = selectedCategory ? "update" : "create";

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleUpdateCategory = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDialogClose = () => setDialogOpen(false);

  /* Delete */
  const [selectedDeleteCategory, setSelectedDeleteCategory] = React.useState<Category | null>(null);
  const [dialogDeleteOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDeleteCategory = (category: Category) => {
    setSelectedDeleteCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

  const value: CategoryContextType = {
    selectedCategory,
    dialogOpen,
    dialogMode,
    handleAddCategory,
    handleUpdateCategory,
    handleDialogClose,
    dialogDeleteOpen,
    selectedDeleteCategory,
    handleDeleteCategory,
    handleDeleteDialogClose,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}
```

## Rules

- File name: `<feature-name>.provider.tsx` (needs `.tsx` — returns JSX)
- Import context from `../context/<feature-name>.context`
- Group state by dialog with comments: `/* Create / Update */`, `/* Delete */`
- `dialogMode` is derived from `selectedCategory` — no separate `useState` for mode
- Open handlers always set the selected item before setting `dialogOpen = true`
- Close handlers only close — they do not reset `selected*` state (stale state is fine while dialog is closed)
- No queries, no mutations — those belong in `query/` and `mutations/`

## Usage in page

The page wraps its content in the provider and uses dynamic imports for dialogs:

```tsx
export default function CategoryPage() {
  return (
    <CategoryProvider>
      <SiteHeader label="Category" />
      <MainPage>
        {/* content */}
        <CategoryDialogs />
      </MainPage>
    </CategoryProvider>
  );
}
```
