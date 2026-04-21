---
title: Styling Guide
description: Design tokens (colors, radius, typography), Tailwind v4 conventions, and shadcn component usage patterns
tags: [styling, tailwind, shadcn, design-tokens, dark-mode]
---

# Styling Guide

## Design Tokens

All tokens are defined as CSS custom properties in `src/app/globals.css`.

### Colors (oklch)

| Token | Light value | Usage |
|-------|-------------|-------|
| `--primary` | `oklch(0.527 0.154 150.069)` | Teal-green — buttons, links, accents |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red — delete actions, error states |
| `--chart-1` … `--chart-5` | Gradient palette | Recharts data visualization |
| `--sidebar-primary` | Custom teal | Sidebar active items |

Dark mode values are inverted/adjusted variants of the same palette. Never hardcode hex — use semantic token names via Tailwind (`bg-primary`, `text-destructive`, etc.).

### Border Radius

Base: `--radius: 0.625rem` (10px). Scaled variants:

| Token | Scale | Approx |
|-------|-------|--------|
| `--radius-sm` | 60% | 6px |
| `--radius-md` | 80% | 8px |
| `--radius-lg` | 100% | 10px |
| `--radius-xl` | 140% | 14px |
| `--radius-2xl` | 180% | 18px |
| `--radius-3xl` | 220% | 22px |
| `--radius-4xl` | 260% | 26px |

Use `rounded-lg`, `rounded-xl`, etc. — they map to these tokens via Tailwind v4.

### Typography

| Token | Usage |
|-------|-------|
| `--font-sans` | Body text |
| `--font-mono` | Geist Mono — code, numbers |
| `--font-heading` | Section headings |
| `--font-display` | Large display text |

---

## Tailwind v4 Conventions

### Dynamic class merging

Always use `cn()` (from `lib/utils.ts`) to merge Tailwind classes:

```ts
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class", className)} />
```

### Dark mode

Dark mode is managed by `next-themes`. Use the `dark:` variant:

```tsx
<div className="bg-white dark:bg-neutral-900" />
```

Never use `[data-theme]` selectors — let `next-themes` handle the class toggle.

### Animations

Use `tw-animate-css` utility classes for entrance/exit animations. Prefer these over custom keyframes.

### Responsive

Standard Tailwind breakpoints apply (`sm`, `md`, `lg`, `xl`). Most layouts are mobile-first.

---

## shadcn Component Patterns

> Check available components at `@src/components/ui` before building new UI.

### Button

```tsx
<Button variant="default">Save</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="icon"><Trash2 /></Button>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>
```

### Dialog vs Drawer

Use `ResponsiveDialog` (custom wrapper in `components/ui/`) — it renders as a Dialog on desktop and a Drawer on mobile:

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen}>
  <ResponsiveDialogContent>
    ...
  </ResponsiveDialogContent>
</ResponsiveDialog>
```

Only use raw `Dialog` or `Drawer` when you need to force one variant.

### Forms (Field + InputGroup)

```tsx
<FieldGroup>
  <FieldLabel>Amount</FieldLabel>
  <InputGroup>
    <InputGroupText>Rp</InputGroupText>
    <Input type="number" {...field.getInputProps()} />
  </InputGroup>
  {field.state.meta.isTouched && !field.state.meta.isValid && (
    <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
  )}
</FieldGroup>
```

### Toasts (Sonner)

```ts
import { toast } from "sonner";

toast.success("Saved successfully");
toast.error("Something went wrong");
```

Always use Sonner — never `alert()` or custom toast state.

### Select

```tsx
<Select value={field.state.value} onValueChange={field.handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="expense">Expense</SelectItem>
    <SelectItem value="income">Income</SelectItem>
  </SelectContent>
</Select>
```
