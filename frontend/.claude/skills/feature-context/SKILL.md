---
name: feature-context
description: >
  Area skill for implementing the context layer of a kashin frontend feature
  (extended layout only). Defines the context type interface and createContext
  call. Loaded by implement-feature when extended layout is chosen. Follow this
  when creating src/features/<name>/context/<name>.context.ts.
user-invocable: false
---

# Feature Context Layer (Extended Layout)

Implement `context/<feature-name>.context.ts`. This file only defines the shape of the context — no state, no handlers, no components.

## Pattern

```ts
// context/category.context.ts
import { Category } from "../types";
import React from "react";

export interface CategoryContextType {
  /* Create / Update dialog */
  selectedCategory: Category | null;
  dialogOpen: boolean;
  dialogMode: "create" | "update";
  handleAddCategory: () => void;
  handleUpdateCategory: (category: Category) => void;
  handleDialogClose: () => void;

  /* Delete dialog */
  selectedDeleteCategory: Category | null;
  dialogDeleteOpen: boolean;
  handleDeleteCategory: (category: Category) => void;
  handleDeleteDialogClose: () => void;
}

export const CategoryContext = React.createContext<CategoryContextType | null>(null);
```

## Rules

- File name: `<feature-name>.context.ts` (kebab-case, `.ts` not `.tsx`)
- Export the interface (`XxxContextType`) and the context object (`XxxContext`)
- Initialize `createContext` with `null` — the null guard lives in `hooks/use-xxx-context.ts`
- No `useState`, no handlers, no JSX — those go in `provider/`
- Model state groups by dialog: one group per dialog (create/update, delete, etc.)
- Handler names follow `handle<Action><FeatureName>` convention

## Dialog state groups

For each dialog, the interface should expose:
- `selected<FeatureName>: FeatureType | null` — the item being acted on (`null` = no selection)
- `dialog<DialogVariant>Open: boolean` — whether the dialog is open
- `handle<OpenAction>: (item?: FeatureType) => void` — opens the dialog
- `handle<CloseAction>: () => void` — closes the dialog
