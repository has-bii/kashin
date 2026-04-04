# Phase 2: Transaction Frontend - Discussion Log

**Date:** 2026-04-04
**Areas covered:** Form entry point, List layout, Filter UX, CSV export scope

---

## Form Entry Point

**Q: How should the transaction form open?**
Options: Sheet/side panel, Dialog/modal, Dedicated page
→ **Selected: Sheet / side panel**

**Q: How is the sheet triggered for editing vs creating?**
Options: Single sheet mode-aware, Row click = edit / FAB = create, You decide
→ **Selected: Single sheet, mode-aware (Recommended)**

**Note from user:** Pagination is handled server-side (reminder during this area)

---

## List Layout

**Q: How should the transaction list be structured?**
Options: Custom transaction list, Adapt data-table.tsx
→ **Selected: Custom transaction list**
(Rationale: data-table.tsx is wired for DnD + client-side pagination — not appropriate for server-side pagination)

**Q: What columns should the transaction list show?**
Options: Date/Amount/Category/Type/Note, Date/Amount/Category/Type only, You decide
→ **Selected: Date, Amount, Category, Type, Note (Recommended)**

**Q: How are row-level actions exposed?**
Options: Click row = open edit sheet, Row actions menu (3-dot), Hover reveals actions
→ **Selected: Click row = open edit sheet, delete in the sheet**

---

## Filter UX

**Q: Where should the filters live on the transactions page?**
Options: Top filter bar always visible, Collapsible filter panel, Inline above each column
→ **Selected: Top filter bar, always visible**
(Contents: Type toggle + Category dropdown + Date range picker + Search)

**Q: What's the default date range when the page loads?**
Options: Current month, No date filter, Last 30 days
→ **Selected: Current month**

---

## CSV Export Scope

**Q: How should CSV export work?**
Options: Export current filtered view, Export dialog with options, Export all transactions
→ **Selected: Export current filtered view**

**Q: Where does the Export button live?**
Options: Page header next to 'Add Transaction', Bulk-select toolbar, You decide
→ **Selected: Page header, next to 'Add Transaction'**

---

*Discussion complete — CONTEXT.md written*
