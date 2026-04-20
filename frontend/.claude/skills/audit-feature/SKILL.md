---
name: audit-feature
description: >
  Audits a kashin frontend feature (src/features/<name>/) against project conventions and fixes all
  violations found. Use this skill whenever the user asks to "audit", "check", "fix", "migrate", or
  "align" a feature to the project pattern. Also invoke when the user says things like "does X follow
  the pattern?", "clean up the Y feature", "make Z match budget", or "apply the pattern to W".
  This skill both reports what's wrong AND applies the fixes — it doesn't just describe problems.
---

# Audit Feature

Audit `src/features/<name>/` against the canonical extended layout pattern and fix every violation.
Do NOT just report problems — fix them.

## Step 1: Read the feature

Read every file in `src/features/<name>/` and `src/app/dashboard/(main)/<name>/page.tsx`.

## Step 2: Check each rule and fix violations

Work through the checklist below. For each violation, fix it immediately before moving to the next item.

---

### Rule 1 — Extended layout structure

The feature must have all nine directories:

```
api/          mutations/    hooks/
query/        context/      components/
provider/     types/        validations/
```

If any are missing and the feature has more than one dialog (create + edit, or create + delete), create the missing directory and implement the missing layer following the conventions in `docs/conventions.md`.

---

### Rule 2 — English-only copy

Scan every `.tsx` / `.ts` file for Indonesian strings. Fix all occurrences:

| Indonesian | English |
|---|---|
| Tambah / Tambahkan | Add |
| Simpan | Save |
| Hapus | Delete |
| Batal | Cancel |
| Ubah / Perbarui | Edit / Update |
| Keterangan | Description |
| Catatan | Notes |
| Jumlah | Amount |
| Tanggal / Waktu | Date / Time |
| Rekening | Account |
| Kategori | Category |
| Tanpa X | No X |
| Berhasil X | X successful → rephrase as "X [noun]" e.g. "Transaction added" |
| Gagal X | Failed to X |
| dipilih | selected |
| transaksi / kategori / anggaran / dll | transaction / category / budget / etc. |
| Hari Ini | Today |
| Belum ada X | No X yet |
| Coba X | Try X |
| Tindakan ini tidak dapat dibatalkan | This action cannot be undone |

Also fix toast messages, page titles (`SiteHeader`, `MainPageTitle`, `MainPageDescripton`), dialog titles and descriptions, button labels, field labels, placeholders, empty state text, and badge/status labels.

---

### Rule 3 — Upsert mutation

If the feature has separate `useCreateXxxMutation` and `useUpdateXxxMutation`, combine them into `useUpsertXxxMutation(id?: string)`:

```ts
export const useUpsertXxxMutation = (id?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: XxxDto) => {
      if (id) return updateXxxApi({ id, input })   // or updateXxxApi(id, input) — match api signature
      return createXxxApi(input)
    },
    onSuccess: () => {
      toast.success(id ? "X updated" : "X added")
      queryClient.invalidateQueries({ queryKey: [XXX_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || (id ? "Failed to update X" : "Failed to add X")),
  })
}
```

Keep `useDeleteXxxMutation` and any bulk-delete mutations as separate hooks.

---

### Rule 4 — Schema and DTO naming

The validations file must export:
- `xxxSchema` (not `xxxCreateSchema`)
- `XxxDto` (not `XxxCreateDto`)

Remove `xxxUpdateSchema` and `XxxUpdateDto` — partial updates use the same DTO.

After renaming, update every import across `api/`, `mutations/`, and `hooks/`.

---

### Rule 5 — Form hook signature

`useXxxForm` must accept `{ prevData?, options? }`:

```ts
interface UseXxxForm {
  prevData?: Xxx | null
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
}

export const useXxxForm = ({ prevData, options }: UseXxxForm) => {
  const mutation = useUpsertXxxMutation(prevData?.id)
  // defaultValues derived from prevData with fallbacks
  // onSubmit: await mutation.mutateAsync(value, options); formApi.reset()
  return { form, mutation }
}
```

Remove discriminated-union `Args` types (`| { mode: "create" } | { mode: "edit"; data: Xxx }`).

---

### Rule 6 — Form component props

`XxxForm` must accept `{ prevData?: Xxx | null; onSuccess?: () => void }`:

```tsx
export function XxxForm({ prevData, onSuccess }: Props) {
  const { form } = useXxxForm({ prevData, options: { onSuccess } })
  // ...
  // Button label: !prevData ? "Add ..." : "Save ..."
  // Delete dialog: {prevData && <XxxDeleteDialog id={prevData.id} onSuccess={onSuccess} />}
}
```

Remove `mode` prop and all branches on `mode === "create"` / `mode === "edit"`.

---

### Rule 7 — Dedicated dialogs component

The feature must have `components/xxx-dialogs.tsx` that reads dialog state from context and renders the main dialog + delete dialog. The page must NOT define `ResponsiveDialog` inline.

Template:

```tsx
"use client"

import { useXxxContext } from "../hooks/use-xxx-context"
import { XxxForm } from "./xxx-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"

export default function XxxDialogs() {
  const { dialogOpen, selectedXxx, handleDialogClose } = useXxxContext()

  const dialogTitle = selectedXxx ? "Edit X" : "Add X"
  const dialogDescription = selectedXxx
    ? "Update the details of this X."
    : "Fill in the details to add a new X."

  return (
    <ResponsiveDialog
      title={dialogTitle}
      description={dialogDescription}
      open={dialogOpen}
      onOpenChange={handleDialogClose}
    >
      <XxxForm prevData={selectedXxx} onSuccess={handleDialogClose} />
    </ResponsiveDialog>
  )
}
```

If a delete dialog exists and is context-driven (state in provider), include it here too alongside `ResponsiveDialog`.

---

### Rule 8 — Page structure

The page must:
- Dynamically import the list component with `ssr: false` and a skeleton `loading:` fallback
- Dynamically import the dialogs component with `ssr: false`
- Wrap content in `<XxxProvider>`
- Use `<QueryErrorBoundary>` around data-fetching components
- NOT define `ResponsiveDialog` inline

```tsx
const XxxList = dynamic(() => import("@/features/xxx/components/xxx-list"), {
  ssr: false,
  loading: () => <XxxListSkeleton />,
})

const XxxDialogs = dynamic(() => import("@/features/xxx/components/xxx-dialogs"), {
  ssr: false,
})

export default function XxxPage() {
  return (
    <XxxProvider>
      {/* ... */}
      <QueryErrorBoundary><XxxList /></QueryErrorBoundary>
      <XxxDialogs />
    </XxxProvider>
  )
}
```

If the page needs context for a button (e.g. "Add" in the header), extract it into a small inner component or a helper component that calls `useXxxContext()`.

---

## Step 3: Run verification

```bash
npx tsc --noEmit 2>&1 | grep "features/<name>"
pnpm run lint 2>&1 | grep "features/<name>"
```

Fix any new type errors introduced by your changes. Pre-existing errors in other features can be ignored.

---

## Step 4: Report

After all fixes are applied, produce a short summary:

```
## Audit complete — <feature-name>

### Fixed
- [x] Rule N — brief description of what was changed

### Already compliant
- [x] Rule N — already correct, no changes needed

### Skipped
- Rule N — reason (e.g. feature uses minimal layout intentionally, no upsert pattern needed)
```

Keep it scannable. One line per rule.
