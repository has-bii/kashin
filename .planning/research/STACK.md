# Technology Stack

**Project:** Kashin — Transaction CRUD + Dashboard Milestone
**Researched:** 2026-04-04
**Scope:** Additions to existing stack for charting, financial data, and date formatting

---

## Existing Stack (Do Not Change)

Already installed and working. Listed for reference only.

| Technology | Version | Role |
|------------|---------|------|
| Bun + Elysia | latest | Backend runtime + API framework |
| Prisma 7 | 7.6.0 | ORM + PostgreSQL adapter |
| Next.js | 16.2.2 | App Router framework |
| React | 19.2.4 | UI rendering with Compiler |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | 4.1.2 | Component library |
| TanStack React Query | 5.96.1 | Server state management |
| TanStack React Table | 8.21.3 | Table primitives |
| Recharts | 3.8.0 | Chart library (already installed) |
| Zod | v4 | Validation (frontend + backend) |
| nuqs | 2.8.9 | URL state (filters) |

---

## Recommended Additions

### Charting

**Use: shadcn/ui Chart primitives (built on Recharts 3)**
- Recharts 3.8.0 is already in the project
- shadcn/ui ships a `<ChartContainer>` wrapper that handles Tailwind theming, responsive sizing, tooltip styling, and dark mode via CSS variables — eliminating boilerplate
- Install with: `pnpm dlx shadcn@latest add chart`
- Provides: AreaChart (spending trends), BarChart (income vs. expenses), PieChart (category breakdown)
- React 19 status: Recharts 3.8.x resolves the earlier `react-is` peer dep conflict; the project's existing lockfile has it working already

**Do NOT use:**
- Chart.js / react-chartjs-2 — heavier bundle, no Tailwind integration, no shadcn alignment
- Victory — unmaintained cadence, no React 19 verified support
- Tremor — opinionated design system that conflicts with shadcn/ui
- D3 directly — low-level, requires significant custom work for standard chart types

**Confidence:** HIGH — Recharts is already installed at the correct version; shadcn Chart is the documented integration path

### Date Formatting

**Use: date-fns v3 (already available via recharts transitive dep; install explicitly)**

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| date-fns | 3.x | Date formatting and arithmetic | Pure functions, ESM tree-shakeable, zero dependencies, works in Bun + Node. v4 exists but is ESM-only and may conflict with Next.js CJS interop |

Install: `pnpm add date-fns`

**Do NOT use:**
- Luxon — larger bundle, class-based API (harder to tree-shake)
- moment.js — deprecated, 67 KB bundle
- date-fns v4 — ESM-only may cause CJS interop issues with Next.js 16 + Bun; stay on v3 until Next.js has full ESM-only mode stable

**Confidence:** MEDIUM — date-fns v3 is the safe choice. v4 ESM-only status needs validation if you upgrade Next.js to full ESM mode.

### Currency / Number Formatting

**Use: Native `Intl.NumberFormat` — no library needed**

```ts
// Reusable formatter (create once, call format() many times)
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
usd.format(1234.56); // "$1,234.56"
```

- Zero bundle cost — built into V8, JavaScriptCore, and Bun
- Handles locale-specific separators, currency symbols, and decimal rules automatically
- Sufficient for a personal tracker where amounts are display-only (no cross-currency arithmetic)

**If multi-currency arithmetic is needed in v2+:** Add `dinero.js` v2 for safe integer-based money math. Not needed for v1.

**Do NOT use:**
- `accounting.js` — unmaintained since 2016
- `currency.js` — fine but redundant when Intl.NumberFormat covers all display needs

**Confidence:** HIGH — Intl.NumberFormat is universally supported and appropriate for a single-currency display use case.

### Transaction Filtering / URL State

**Already installed: nuqs 2.8.9** — use for date range, category filter, and transaction type filter in the dashboard. No addition needed.

**Confidence:** HIGH

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Charting | shadcn Chart + Recharts | Chart.js | Heavier, no Tailwind/shadcn theming |
| Charting | shadcn Chart + Recharts | Tremor | Competing design system, conflicts with shadcn |
| Date formatting | date-fns v3 | Luxon | Larger bundle, class-based |
| Currency display | Intl.NumberFormat | dinero.js | Overkill for display-only; add in v2 if multi-currency math needed |

---

## Installation

```bash
# Frontend — chart primitives (uses existing recharts 3.8.0)
pnpm dlx shadcn@latest add chart

# Frontend — date formatting
pnpm add date-fns

# No additional install needed for Intl.NumberFormat (native)
```

No backend additions required for this milestone. Transaction data is simple CRUD; aggregations (sum by category, monthly totals) can be done in SQL via Prisma raw queries or in-memory on small datasets.

---

## Sources

- [shadcn/ui Chart docs](https://ui.shadcn.com/docs/components/radix/chart)
- [shadcn/ui React 19 compatibility](https://ui.shadcn.com/docs/react-19)
- [Recharts React 19 issue #4558](https://github.com/recharts/recharts/issues/4558)
- [Recharts releases / v3.8.x](https://github.com/recharts/recharts/releases)
- [date-fns npm](https://www.npmjs.com/package/date-fns)
- [Intl.NumberFormat MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [dinero.js](https://www.dinerojs.com/)
