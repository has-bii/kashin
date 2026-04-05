---
mode: quick-full
must_haves:
  - truths:
      - Frontend uses next-intl for i18n with en/id locales
      - locale field exists on User model in Prisma schema and Better Auth additionalFields
      - 6 components use useTranslations() from next-intl
      - locale-utils.ts is currency formatting only, NOT translation i18n
  - artifacts:
      - "layout.tsx: remove I18nProvider, dynamic imports, cookie-based locale"
      - "6 components: replace useTranslations() with inline English strings"
      - "change-locale-form.tsx: delete entirely"
      - "settings page.tsx: remove ChangeLocaleForm import and usage"
      - "auth-client.ts: drop locale from UserWithProfile type"
      - "backend auth.ts: drop locale from additionalFields"
      - "schema.prisma: remove locale from User model"
      - "i18n/ and messages/ directories: delete"
      - "next-intl package: uninstall"
  - key_links:
      - ".planning/quick/260405-jvv-remove-language-i18n-feature-from-fronte/260405-jvv-RESEARCH.md"
      - ".planning/quick/260405-jvv-remove-language-i18n-feature-from-fronte/260405-jvv-CONTEXT.md"
---

# Quick Task 260405-jvv: Remove i18n/locale from frontend and database

## Task 1: Remove next-intl dependency and i18n infrastructure

**files:**
- `frontend/package.json`
- `frontend/src/app/layout.tsx`
- `frontend/src/i18n/provider.tsx`
- `frontend/src/i18n/request.ts`
- `frontend/src/messages/en.json`
- `frontend/src/messages/id.json`

**action:**
1. Uninstall `next-intl` from frontend: `cd frontend && pnpm remove next-intl`
2. Rewrite `layout.tsx` — remove all i18n-related code:
   - Remove `import { I18nProvider } from "@/i18n/provider"`
   - Remove `import enMessages from "@/messages/en.json"`
   - Remove `cookieStore.get("locale")`, `messages` logic
   - Set `lang="en"` directly on `<html>`
   - Remove `<I18nProvider>` wrapper — just render `<Providers>{children}</Providers>` directly
3. Delete `frontend/src/i18n/` directory (provider.tsx, request.ts)
4. Delete `frontend/src/messages/` directory (en.json, id.json)

**verify:**
- layout.tsx has no references to I18nProvider, locale, messages, or next-intl
- i18n/ and messages/ directories no longer exist
- `pnpm remove next-intl` succeeds and package.json no longer lists next-intl
- `html` element has `lang="en"` hardcoded

**done:** false

## Task 2: Replace useTranslations() with inline strings in 6 components

**files:**
- `frontend/src/features/dashboard/components/SectionCards.tsx`
- `frontend/src/features/dashboard/components/CategoryBreakdownChart.tsx`
- `frontend/src/features/dashboard/components/MonthlyTrendsChart.tsx`
- `frontend/src/features/dashboard/components/RecentTransactionsWidget.tsx`
- `frontend/src/features/transaction/components/TransactionList.tsx`
- `frontend/src/features/transaction/components/TransactionFilterBar.tsx`

**action:**
Replace all `useTranslations()` calls with the English strings from the messages file. Details per component:

### SectionCards.tsx
- Remove `import { useTranslations } from "next-intl"` and `const t = useTranslations("dashboard.section")`
- Replace `t("totalIncome")` → `"Total Income"`
- Replace `t("totalExpenses")` → `"Total Expenses"`
- Replace `t("netBalance")` → `"Net Balance"`
- Replace `t("savingsRate")` → `"Savings Rate"`
- Replace `t("currentMonth")` → `"Current month"`
- Replace `t("incomeExceeds")` → `"Income exceeds expenses"`
- Replace `t("expensesExceed")` → `"Expenses exceed income"`
- Replace `t("noChange")` → `"No change"`
- Replace `t("onTrack")` → `"On track"`
- Replace `t("negativeSavings")` → `"Negative savings"`

### CategoryBreakdownChart.tsx
- Remove `import { useTranslations } from "next-intl"` and `const t = useTranslations("dashboard.category")`
- Replace `t("title")` → `"Spending by Category"`
- Replace `t("currentMonth", { defaultValue: "Current month" })` → `"Current month"`
- Replace `t("noSpending")` → `"No spending this month"`
- Replace `t("total")` → `"Total"`

### MonthlyTrendsChart.tsx
- Remove `import { useTranslations } from "next-intl"` and `const t = useTranslations("dashboard.monthlyTrends")`
- Replace `t("title")` → `"Monthly Trends"`
- Replace `t("description", { count: months, defaultValue: ... })` → `` `Income vs. expenses over the last ${months} months` ``
- Replace `t("noData")` → `"No transactions this period"`

### RecentTransactionsWidget.tsx
- Remove `import { useTranslations } from "next-intl"` and `const t = useTranslations("dashboard.recentTransactions")`
- Replace `t("title")` → `"Recent Transactions"`
- Replace `t("noTransactions")` → `"No transactions yet"`
- Replace `t("uncategorized", { defaultValue: "Uncategorized" })` → `"Uncategorized"`

### TransactionList.tsx
- Remove `import { useTranslations } from "next-intl"` and `const t = useTranslations("transaction.list")`
- Replace `t("noResults")` → `"No transactions found"`
- Replace `t("noResultsDesc")` → `"Try adjusting your filters or add a new transaction."`
- Replace `t("date")` → `"Date"`
- Replace `t("amount")` → `"Amount"`
- Replace `t("category")` → `"Category"`
- Replace `t("type")` → `"Type"`
- Replace `t("note")` → `"Note"`
- Replace `t("uncategorized")` → `"Uncategorized"`
- Replace `t("income")` → `"Income"`
- Replace `t("expense")` → `"Expense"`

### TransactionFilterBar.tsx
- Remove `import { useTranslations } from "next-intl"` and `const t = useTranslations("transaction.filters")`
- Replace `TYPE_OPTIONS` array — change `labelKey` to direct `label` values:
  - `all` → `"All"`
  - `expenseFilter` → `"Expense"`
  - `incomeFilter` → `"Income"`
- Replace `t(opt.labelKey)` in the render → `opt.label` directly

**verify:**
- No `useTranslations` imports remain anywhere in frontend
- No `next-intl` imports remain anywhere in frontend
- All components render identical English text as before
- TypeScript types check passes

**done:** false

## Task 3: Remove locale from backend and user settings UI

**files:**
- `backend/prisma/schema.prisma`
- `backend/src/lib/auth.ts`
- `frontend/src/lib/auth-client.ts`
- `frontend/src/features/settings/profile/components/change-locale-form.tsx`
- `frontend/src/app/dashboard/settings/page.tsx`

**action:**
1. **schema.prisma** — Remove `locale` field from the `User` model
2. **backend auth.ts** — Remove `locale` from `user.additionalFields`
3. **auth-client.ts** — Remove `locale: string` from `UserWithProfile` type
4. **Delete** `change-locale-form.tsx` entirely
5. **settings page.tsx** — Remove `import ChangeLocaleForm` and `<ChangeLocaleForm />` usage

**verify:**
- No references to `locale` exist in schema.prisma User model
- No `locale` in Better Auth additionalFields
- `UserWithProfile` type has only `currency` and `timezone` (no `locale`)
- `change-locale-form.tsx` file is deleted
- Settings page doesn't import or render locale form
- `locale-utils.ts` is untouched (it's for currency formatting)

**done:** false

## Task 4: Reset migrations and regenerate Prisma

**files:**
- `backend/prisma/migrations/` (directory)
- `backend/prisma/schema.prisma`

**action:**
1. Delete `backend/prisma/migrations/` directory entirely
2. Run `cd backend && bunx --bun prisma migrate reset`
3. Run `cd backend && bunx --bun prisma migrate dev --name init`
4. Run `cd backend && bunx --bun prisma generate`

**verify:**
- `backend/prisma/migrations/` exists with new `init` migration
- Migration SQL does NOT contain `locale` column
- `backend/src/generated/prisma/` is regenerated
- Prisma client compiles without type errors for removed locale field

**done:** false
