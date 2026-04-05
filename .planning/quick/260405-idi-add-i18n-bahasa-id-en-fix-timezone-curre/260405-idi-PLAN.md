---
phase: quick
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - backend/prisma/schema.prisma
  - backend/src/lib/auth.ts
  - frontend/src/i18n/request.ts
  - frontend/src/i18n/provider.tsx
  - frontend/src/i18n/routing.ts
  - frontend/messages/en.json
  - frontend/messages/id.json
  - frontend/src/app/layout.tsx
autonomous: true
requirements: []
must_haves:
  truths:
    - "User model has a locale field defaulting to 'en'"
    - "Better Auth accepts locale in User update requests"
    - "Prisma schema reflects locale String field on User"
    - "next-intl request.ts config is exportable for Next.js App Router"
    - "Translation provider wraps app root and supplies messages"
    - "en.json and id.json files contain structured translation keys for dashboard, transactions, settings, and common UI"
  artifacts:
    - path: "backend/prisma/schema.prisma"
      provides: "locale String @default('en') on User model"
      contains: "locale String @default(\"en\") @db.Char(2)"
    - path: "backend/src/lib/auth.ts"
      provides: "locale in additionalFields"
      contains: "locale:"
    - path: "frontend/src/i18n/request.ts"
      provides: "Server-side getRequestConfig for next-intl"
      exports: ["default"]
    - path: "frontend/src/i18n/provider.tsx"
      provides: "Client-side NextIntlClientProvider wrapper"
      exports: ["I18nProvider"]
    - path: "frontend/src/i18n/routing.ts"
      provides: "Empty routing config with localePrefix: 'never'"
      exports: ["routing"]
    - path: "frontend/src/app/layout.tsx"
      provides: "I18nProvider wrapping children"
      imports: "@/*i18n/provider"
    - path: "frontend/messages/en.json"
      provides: "English translation keys"
      min_lines: 40
    - path: "frontend/messages/id.json"
      provides: "Bahasa Indonesia translation keys (mirror structure of en.json)"
      min_lines: 40
  key_links:
    - from: "backend/prisma/schema.prisma"
      to: "backend/src/lib/auth.ts"
      via: "Better Auth additionalFields references User.locale"
      pattern: "additionalFields.*locale"
    - from: "frontend/src/i18n/request.ts"
      to: "frontend/messages/*.json"
      via: "dynamic import"
      pattern: "import.*messages.*locale"
    - from: "frontend/src/app/layout.tsx"
      to: "frontend/src/i18n/provider.tsx"
      via: "React wrapper in tree"
      pattern: "I18nProvider"
---

<objective>
Add `locale` field to User model (backend) and set up next-intl i18n infrastructure (frontend), including translation files for en and id.

Purpose: Establish the foundation for bilingual support (Bahasa Indonesia + English) and prepare the database for per-user locale storage.
Output: Updated schema, auth config, i18n provider, request config, routing stub, and translation message files (en.json + id.json).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md — v1.0 milestone complete, no blockers
@.planning/quick/260405-idi-add-i18n-bahasa-id-en-fix-timezone-curre/260405-idi-CONTEXT.md — user decisions
@.planning/quick/260405-idi-add-i18n-bahasa-id-en-fix-timezone-curre/260405-idi-RESEARCH.md — research findings

@backend/prisma/schema.prisma — Current User model (currency, timezone fields exist as patterns, locale to be added similarly)
@backend/src/lib/auth.ts — Better Auth config with existing additionalFields (currency, timezone — locale follows same pattern)
@frontend/package.json — date-fns v4.1.0 already present (needed for date-fns-tz v3 compatibility)
@frontend/src/app/layout.tsx — Root layout to be updated with I18nProvider wrapper

# Key patterns from codebase
From backend/src/lib/auth.ts (lines 11-25):
- additionalFields pattern: { fieldName: { type: "string", required: false, defaultValue: "...", input: true } }
- currency defaults to "IDR", timezone defaults to "Asia/Jakarta" — locale should default to "en"

From backend/prisma/schema.prisma (lines 78-79):
- Existing user profile fields: `currency String @default("IDR") @db.Char(3)` and `timezone String @default("Asia/Jakarta") @db.VarChar(64)`
- locale should follow: `locale String @default("en") @db.Char(2)`
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add locale field to User model and Better Auth config</name>
  <files>backend/prisma/schema.prisma, backend/src/lib/auth.ts</files>
  <action>
    1. Add `locale String @default("en") @db.Char(2)` to the User model in schema.prisma, placing it right after the `timezone` field (line 79).

    2. In backend/src/lib/auth.ts, add locale to the `user.additionalFields` object with: `{ locale: { type: "string", required: false, defaultValue: "en", input: true } }`.

    3. Run `bunx --bun prisma generate` to regenerate the Prisma client.

    4. Run `bunx --bun prisma db push` to push the schema change to the database (add a default, no data loss).

    5. Verify by checking `bunx --bun prisma db pull --print` shows the locale field, or query the users table schema.
  </action>
  <verify>
    <automated>bunx --bun prisma db push --accept-data-loss 2>&1 | tail -5</automated>
  </verify>
  <done>Schema has locale field on User, auth.ts accepts locale in additionalFields, Prisma client regenerated, database schema pushed successfully.</done>
</task>

<task type="auto">
  <name>Task 2: Install next-intl + create i18n infrastructure (provider, request, routing)</name>
  <files>frontend/src/i18n/request.ts, frontend/src/i18n/provider.tsx, frontend/src/i18n/routing.ts, frontend/src/app/layout.tsx, frontend/src/lib/locale-utils.ts</files>
  <action>
    1. Install dependencies: `cd frontend && pnpm add next-intl date-fns-tz` (use pnpm, never npm — per project memory).

    2. Create `frontend/src/i18n/routing.ts` — export empty routing config with `localePrefix: "never"` to disable URL routing (standalone mode for next-intl with Next.js 16 App Router):
    ```typescript
    import { defineRouting } from 'next-intl/routing'
    export const routing = defineRouting({
      locales: ['en', 'id'],
      defaultLocale: 'en',
      localePrefix: 'never',
    })
    ```

    3. Create `frontend/src/i18n/request.ts` — server-side config that loads messages dynamically. Import messages from `../../messages/`. Detect locale from better-auth cookie (read `better-auth.session_token` cookie) or fallback to 'en'. For initial implementation, fallback to 'en' and add a TODO comment for session-based detection:
    ```typescript
    import { getRequestConfig } from 'next-intl/server'
    import { cookies } from 'next/headers'

    export default getRequestConfig(async () => {
      // TODO: Read locale from user session once API endpoint exists
      // Currently falling back to 'en' — locale resolved client-side via session
      const locale = 'en'
      return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
      }
    })
    ```

    4. Create `frontend/src/i18n/provider.tsx` — client-side provider wrapper:
    ```typescript
    'use client'
    import { NextIntlClientProvider } from 'next-intl'

    export function I18nProvider({
      locale,
      messages,
      children,
    }: { locale: string; messages: Record<string, string>; children: React.ReactNode }) {
      return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      )
    }
    ```

    5. Create `frontend/src/lib/locale-utils.ts` — the CURRENCY_LOCALE mapping and formatCurrency helper (will be used by Plan 2):
    ```typescript
    const CURRENCY_LOCALE: Record<string, Intl.LocalesArgument> = {
      IDR: 'id-ID',
      USD: 'en-US',
      EUR: 'de-DE',
      JPY: 'ja-JP',
    }

    export function getCurrencyLocale(currency: string): Intl.LocalesArgument {
      return CURRENCY_LOCALE[currency] ?? 'en-US'
    }

    export function formatCurrency(amount: number | string, currency: string): string {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount
      const locale = getCurrencyLocale(currency)
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'IDR' ? 0 : 2,
      }).format(num)
    }
    ```

    6. Update `frontend/src/app/layout.tsx` — import `I18nProvider` and wrap children. Import default messages from `../../messages/en.json` for SSR. Pass locale='en' and messages to I18nProvider for server render. Client components will override via session in Plan 3.

    7. Import routing from i18n/routing.ts into layout.tsx if next-intl requires it for build compatibility.
  </action>
  <verify>
    <automated>cd frontend && pnpm exec next build 2>&1 | tail -10</automated>
  </verify>
  <done>Dependencies installed, i18n/request.ts, i18n/provider.tsx, i18n/routing.ts, lib/locale-utils.ts created, layout.tsx updated with I18nProvider, build passes without errors.</done>
</task>

<task type="auto">
  <name>Task 3: Create translation files en.json + id.json</name>
  <files>frontend/messages/en.json, frontend/messages/id.json</files>
  <action>
    Create two translation files with nested keys covering ALL user-visible text across the app. The structure must mirror exactly between en.json and id.json.

    **en.json** — English (current defaults):
    Namespace keys: dashboard, transaction, category, settings, common, auth.

    Dashboard section: section.totalIncome, section.totalExpenses, section.netBalance, section.savingsRate, section.currentMonth, section.incomeExceeds, section.expensesExceed, section.noChange, section.onTrack, section.negativeSavings, recent.title, recent.subtitle, recent.noTransactions, recent.noTransactionsDesc, recent.addFirst, category.title, category.currentMonth, category.total, category.noSpending, category.unknown

    Transaction section: list.title, list.noResults, list.noResultsDesc, list.date, list.amount, list.category, list.type, list.note, list.uncategorized, list.income, list.expense, list.selectAll, list.select, filter.all, filter.expense, filter.income, filter.allCategories, filter.searchPlaceholder

    Settings section: currency.title, currency.desc, currency.save, currency.usedFor, currency.placeholder, locale.title, locale.desc, locale.save, locale.english, locale.indonesian, locale.placeholder

    Common section: save, cancel, loading, settings, dashboard, transactions, categories

    Auth section: login, register, verifyEmail, forgotPassword, resetPassword

    **id.json** — Bahasa Indonesia translations (mirror keys):
    - Total Income → "Total Pemasukan"
    - Total Expenses → "Total Pengeluaran"
    - Net Balance → "Saldo Bersih"
    - Savings Rate → "Rasio Tabungan"
    - Current month → "Bulan ini"
    - Income exceeds expenses → "Pemasukan melebihi pengeluaran"
    - Expenses exceed income → "Pengeluaran melebihi pemasukan"
    - No change → "Tidak ada perubahan"
    - On track → "Sesuai rencana"
    - Negative savings → "Tabungan negatif"
    - Recent Transactions → "Transaksi Terbaru"
    - Your last 10 transactions → "10 transaksi terakhir Anda"
    - No transactions yet → "Belum ada transaksi"
    - Add your first transaction to get started → "Tambahkan transaksi pertama Anda untuk memulai"
    - Spending by Category → "Pengeluaran per Kategori"
    - No spending this month → "Tidak ada pengeluaran bulan ini"
    - Total → "Total"
    - Uncategorized → "Tanpa Kategori"
    - Date → "Tanggal"
    - Amount → "Jumlah"
    - Category → "Kategori"
    - Type → "Tipe"
    - Note → "Catatan"
    - Income → "Pemasukan"
    - Expense → "Pengeluaran"
    - Transactions → "Transaksi"
    - No transactions found → "Tidak ada transaksi ditemukan"
    - Try adjusting your filters or add a new transaction → "Coba sesuaikan filter atau tambahkan transaksi baru"
    - All → "Semua"
    - Expense → "Pengeluaran"
    - All Categories → "Semua Kategori"
    - Search transactions... → "Cari transaksi..."
    - Currency → "Mata Uang"
    - Choose the currency used to display your transactions → "Pilih mata uang yang digunakan untuk menampilkan transaksi Anda"
    - Used for display purposes across the app → "Digunakan untuk keperluan tampilan di seluruh aplikasi"
    - Save → "Simpan"
    - Currency updated → "Mata uang diperbarui"
    - Unexpected error has occurred → "Terjadi kesalahan yang tidak terduga"
    - Select a currency → "Pilih mata uang"
    - Language → "Bahasa"
    - Choose your preferred language → "Pilih bahasa yang Anda inginkan"
    - English → "Bahasa Inggris"
    - Indonesian → "Bahasa Indonesia"
    - Settings → "Pengaturan"
    - Dashboard → "Dasbor"
  </action>
  <verify>
    <automated>cd frontend && node -e "const en=require('./messages/en.json');const id=require('./messages/id.json');const flatten=(o,p='')=>Object.keys(o).reduce((a,k)=>typeof o[k]==='object'?{...a,...flatten(o[k],p+k+'.')}:{...a,[p+k]:o[k]},{});const e=flatten(en),i=flatten(id);const m=e.filter(k=>!i[k]);const n=i.filter(k=>!e[k]);if(m.length||n.length){console.log('EN missing:',n);console.log('ID missing:',m);process.exit(1)}console.log('Keys match:',Object.keys(e).length)"</automated>
  </verify>
  <done>en.json and id.json created with matching key structures, covering all user-visible text (dashboard, transactions, settings, common, auth). Key count verification script passes.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| browser→backend | User locale preference stored in DB, read via authenticated session |
| client→i18n provider | Messages loaded server-side, no untrusted input reaches translation layer |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-01 | Tampering | backend/prisma/schema.prisma | mitigate | locale field uses @db.Char(2) — fixed length prevents injection via oversized input |
| T-quick-02 | Spoofing | frontend/src/i18n/request.ts | accept | Locale defaults to 'en', read from session cookie only — no URL-based manipulation possible (localePrefix: 'never') |
| T-quick-03 | Information Disclosure | frontend/messages/*.json | accept | Translation files are static, contain no secrets or PII, public-read is acceptable |
</threat_model>

<verification>
- Prisma schema pushed without errors
- `bunx --bun prisma db push` completes successfully
- `pnpm exec next build` passes in frontend
- Translation key count matches between en.json and id.json
- I18nProvider renders without hydration mismatch
- locale-utils exports formatCurrency and getCurrencyLocale with correct types
</verification>

<success_criteria>
- User model in database has `locale CHAR(2) DEFAULT 'en'` column
- Better Auth accepts `locale` field in updateUser calls
- next-intl provider wraps root layout, messages load for 'en' locale
- Messages/en.json and messages/id.json exist with 40+ keys each covering dashboard, transactions, settings, and common UI
- locale-utils.ts exports formatCurrency with locale-per-currency mapping and IDR minimumFractionDigits: 0
- No TypeScript errors, Next.js build passes
</success_criteria>

<output>
After completion, create `.planning/quick/260405-idi-add-i18n-bahasa-id-en-fix-timezone-curre/quick-01-SUMMARY.md`
</output>
