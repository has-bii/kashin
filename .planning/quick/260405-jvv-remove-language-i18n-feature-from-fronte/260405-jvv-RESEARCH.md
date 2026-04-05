# Quick Task 260405-jvv: Research — Remove i18n and locale

**Gathered:** 2026-04-05

## Key Findings

### 1. next-intl removal
- `next-intl` is used as a client-side i18n provider via `I18nProvider` wrapping `NextIntlClientProvider`
- The `layout.tsx` reads a `locale` cookie and dynamically imports `en.json` or `id.json`
- Removing it requires: uninstall package, remove provider from layout, remove `src/i18n/` directory, remove `src/messages/` directory
- `layout.tsx` becomes simpler — no cookie reading, no dynamic imports, no I18nProvider wrapper
- The `getRequestConfig` in `src/i18n/request.ts` is a next-intl server config — delete entirely

### 2. Components using useTranslations()
6 components call `useTranslations()`. When replacing with inline strings:
- **SectionCards.tsx**: `t("totalIncome")`, `t("currentMonth")`, etc. — ~12 translation calls
- **CategoryBreakdownChart.tsx**: `t("title")`, `t("currentMonth")`, `t("noSpending")`, `t("total")` — ~4 calls + one with defaultValue
- **MonthlyTrendsChart.tsx**: `t("title")`, `t("description")`, `t("noData")` — ~3 calls
- **RecentTransactionsWidget.tsx**: `t("title")`, `t("noTransactions")`, `t("uncategorized")` — ~3 calls
- **TransactionList.tsx**: `t("noResults")`, `t("noResultsDesc")`, `t("date")`, `t("amount")`, etc. — ~10 calls
- **TransactionFilterBar.tsx**: `t("all")`, `t("expenseFilter")`, `t("incomeFilter")` via TYPE_OPTIONS — ~3 calls

### 3. Backend locale field
- Prisma schema: `locale String @default("en") @db.Char(2)` on User model
- Better Auth: `locale` in `additionalFields` config — controls what the auth API accepts
- `auth-client.ts`: `UserWithProfile` type includes `locale: string`
- `ChangeLocaleForm` component: full UI for changing locale — delete entirely
- Settings page: imports and renders `ChangeLocaleForm` — remove import and usage

### 4. Database migration approach (as specified by user)
- Delete `backend/prisma/migrations/` directory entirely
- Run `bunx --bun prisma migrate reset` (drops all data)
- Run `bunx --bun prisma migrate dev --name init` (creates fresh migration)
- Run `bunx --bun prisma generate` (regenerates Prisma client)

### 5. Files to NOT touch
- `locale-utils.ts` — handles currency formatting with Intl.NumberFormat locale tags, NOT translation
- `calendar.tsx` — locale prop is for react-day-picker day formatting, independent of i18n

## Integration Points
- Removing locale from Better Auth additionalFields means the `locale` field on the DB User model won't be exposed via auth API (but it won't exist after schema change)
- After removing `next-intl`, all `import { useTranslations }` lines must be removed from components
