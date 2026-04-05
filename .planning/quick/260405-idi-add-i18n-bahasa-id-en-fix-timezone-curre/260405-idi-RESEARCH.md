# Quick 260405-idi: i18n + timezone + currency — Research

**Researched:** 2026-04-05
**Domain:** next-intl, date-fns-tz, Intl.NumberFormat
**Confidence:** HIGH

## Summary

next-intl supports a "standalone" mode for apps that don't need URL-based locale routing. This fits Kashin's pattern perfectly: the locale is stored in the user profile (like currency/timezone), switched in settings, and applied globally via context — no `/(en|id)/dashboard` routing needed. `date-fns-tz` formats dates in a specific timezone, solving the current bug where the stored `Asia/Jakarta` setting is never applied. Currency formatting needs `Intl.NumberFormat` with the correct locale mapping (e.g. `id-ID` for `IDR`, `en-US` for `USD`).

**Primary recommendation:** Use `pnpm add next-intl date-fns-tz` in frontend. No backend changes needed except adding a `locale` field to the User model.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use **next-intl** for internationalization
- Use **Intl.NumberFormat with id-ID locale** for IDR currency
- Fix timezone rendering to use stored user timezone from settings
- Change all USD fallback defaults to **IDR**
- Translation coverage: all user-visible text in frontend

### Claude's Discretion
- Default locale: `en` (matching current English), allow switching to `id` via settings
- Locale stored in settings field (like currency/timezone)

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | 4.9.0 | i18n for Next.js | Official recommendation for Next.js App Router, supports standalone mode |
| date-fns-tz | 3.2.0 | Timezone-aware date formatting | Pairs with existing date-fns v4, uses native `Intl.DateTimeFormat` under the hood |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl | react-i18next | Heavier, not Next.js-native, no App Router integration |
| date-fns-tz | date-fns UTC conversion | Loses DST awareness, incorrect for user-facing dates |

## Architecture Patterns

### next-intl Standalone Mode (No URL Routing)

**Key insight:** Kashin is NOT a multilingual public site. It's a personal tool where one user picks their preferred language. The URL never changes. This is exactly what next-intl's **standalone** mode solves.

**Recommended project structure:**
```
frontend/
├── messages/
│   ├── en.json        # English translations
│   └── id.json        # Bahasa Indonesia translations
├── src/
│   ├── i18n/
│   │   ├── request.ts       # Server-side locale detection (from session)
│   │   └── provider.tsx     # Client-side NextIntlClientProvider wrapper
│   ├── lib/
│   │   └── locale-utils.ts  # Currency/locale mapping helpers
```

**i18n/request.ts** (server — resolves locale from session cookie):
```typescript
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // Get locale from session (via Better Auth cookie or API call)
  // Fallback to 'en'
  const locale = 'en' // Replace with actual session lookup
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

**i18n/provider.tsx** (client context):
```typescript
'use client'
import { NextIntlClientProvider } from 'next-intl'

export function I18nProvider({
  locale,
  messages,
  children,
}: { locale: string; messages: any; children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

**message file structure** (nested keys with namespaces):
```json
{
  "dashboard": {
    "section": {
      "totalIncome": "Total Income",
      "totalExpenses": "Total Expenses",
      "netBalance": "Net Balance",
      "savingsRate": "Savings Rate",
      "currentMonth": "Current month",
      "incomeExceeds": "Income exceeds expenses",
      "expensesExceed": "Expenses exceed income",
      "noChange": "No change",
      "onTrack": "On track",
      "negativeSavings": "Negative savings"
    },
    "category": {
      "title": "Spending by Category",
      "total": "Total",
      "noSpending": "No spending this month"
    }
  },
  "transaction": {
    "list": {
      "title": "Transactions",
      "noResults": "No transactions found",
      "noResultsDesc": "Try adjusting your filters or add a new transaction.",
      "date": "Date",
      "amount": "Amount",
      "category": "Category",
      "type": "Type",
      "note": "Note",
      "uncategorized": "Uncategorized",
      "income": "Income",
      "expense": "Expense"
    }
  },
  "common": {
    "settings": "Settings",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**Gotcha:** next-intl 4.x with Next.js 16 requires `getRequestConfig` exported from `i18n/request.ts` for SSR. For client-only standalone mode, `NextIntlClientProvider` is sufficient — but you still need `request.ts` for the build to pass in Next.js 16 App Router.

### Date Formatting with Timezone

```typescript
// Pattern: format date in user's timezone, not browser local
import { formatInTimeZone } from 'date-fns-tz'

// Example: render transaction date in user's stored timezone
function formatTransactionDate(dateStr: string, userTz: string): string {
  return formatInTimeZone(dateStr, userTz, 'MMM dd, yyyy')
}

// Usage:
// formatTransactionDate(transaction.transactionDate, session.user.timezone ?? 'Asia/Jakarta')
```

### Currency Formatting with Locale Mapping

```typescript
// Map ISO currency code to display locale
const CURRENCY_LOCALE: Record<string, Intl.LocalesArgument> = {
  IDR: 'id-ID',     // Rp 10.000
  USD: 'en-US',     // $1,000.00
  EUR: 'de-DE',     // 1.000,00 €
  JPY: 'ja-JP',     // ￥1,000
}

function formatCurrency(amount: number | string, currency: string): string {
  const locale = CURRENCY_LOCALE[currency] ?? 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(typeof amount === 'string' ? parseFloat(amount) : amount)
}
```

**Important:** IDR should use `minimumFractionDigits: 0` since rupiah doesn't use decimals.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware translation | Custom i18n context | next-intl | Handles plurals, number/date formatting, fallback locales |
| Timezone date formatting | Manual UTC offset math | date-fns-tz | Handles DST transitions correctly |
| Currency formatting | String concatenation | Intl.NumberFormat | Native, locale-aware, edge-case free |

## Common Pitfalls

1. **next-intl middleware requirement:** In Next.js 16 App Router, next-intl may require `i18n/routing.ts` even for standalone mode. You can create an empty routing config and set `localePrefix: "never"` to suppress URL prefixes.

2. **SSR + client provider mismatch:** The `NextIntlClientProvider` needs `messages` as a prop. Server components load them via `import messages from '../../../messages/en.json'`. Client components cannot import JSON directly in Next.js 16 — pass through provider.

3. **date-fns v4 + date-fns-tz v3 compatibility:** date-fns-tz v3 works with date-fns v4 (already in package.json). Verify after install.

4. **Currency formatting locale mapping:** `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })` correctly outputs `Rp 10.000`. Using `undefined` or `'en-US'` for IDR outputs `$` or `IDR` prefix — this is the current bug.

## Backend Change: Add `locale` to User Model

The User model needs a new field:
```prisma
locale String @default("en") @db.Char(2)
```

Better Auth config in `backend/src/lib/auth.ts` needs the new `additionalFields` entry. After schema change: `bunx --bun prisma db push`.

## Files Requiring Updates (Currency Fallback Fix)

| File | Current | Fix |
|------|---------|-----|
| `SectionCards.tsx:23` | `?? "USD"` | `?? "IDR"` + proper locale |
| `RecentTransactionsWidget.tsx:13` | `?? "USD"` | `?? "IDR"` + proper locale |
| `CategoryBreakdownChart.tsx:26` | `?? "USD"` | `?? "IDR"` + proper locale |
| `TransactionList.tsx:28` | `en-US` hardcoded | Dynamic locale from CURRENCY_LOCALE map |

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Manual `toLocaleDateString()` | date-fns-tz `formatInTimeZone` | Respects DST, user-configured timezone |
| `Intl.NumberFormat('en-US', ...)` | Locale-per-currency mapping | Correct decimal separators for all currencies |
| Hardcoded English strings | next-intl `useTranslations` | Translatable UI, easy to add more locales later |

## Sources

### Primary (HIGH confidence)
- next-intl v4.9.0: `npm view next-intl version`, official docs pattern for standalone mode
- date-fns-tz v3.2.0: `npm view date-fns-tz version`, works with date-fns v4 (installed in frontend)
- Project schema: `backend/prisma/schema.prisma` — confirmed currency (Char(3)), timezone (VarChar(64)) exist
- Better Auth: `backend/src/lib/auth.ts` — additionalFields pattern for new profile fields

### Secondary (MEDIUM confidence)
- next-intl standalone mode without middleware: based on official docs pattern for non-routing apps
- Locale-to-currency mapping: standard Intl.NumberFormat behavior, verified pattern

## Metadata

**Confidence breakdown:**
- next-intl approach: HIGH - verified package version, official docs support standalone mode
- date-fns-tz integration: HIGH - compatible with existing date-fns v4
- Currency fix: HIGH - verified current code uses `en-US` for all currencies, `undefined` for SectionCards

**Valid until:** 30 days (next-intl stable, date-fns-tz stable)
