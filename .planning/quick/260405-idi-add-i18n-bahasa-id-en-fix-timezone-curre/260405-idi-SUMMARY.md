# Quick 260405-idi: i18n + timezone + currency — Summary

**Executed:** 2026-04-05
**Status:** Completed

## What was built

Added bilingual support (Bahasa Indonesia + English), fixed timezone rendering to use stored user timezone, and corrected currency formatting.

### Changes

**Backend:**
- Added `locale` String field to User model in Prisma schema
- Regenerated Prisma client and pushed to database
- Added locale to Better Auth additionalFields config

**Frontend:**
- Installed `next-intl` and `date-fns-tz` packages
- Created i18n infrastructure: `i18n/request.ts` (cookie-based detection), `I18nProvider` wrapper
- Created `messages/en.json` and `messages/id.json` with 70+ translation keys
- Created `change-locale-form.tsx` settings component (cookie refresh on save)
- Updated `layout.tsx` to wrap app with I18nProvider
- Added `locale` to `UserWithProfile` type

**Component updates:**
- `SectionCards.tsx`: locale-aware currency (IDR default), translations
- `CategoryBreakdownChart.tsx`: locale-aware currency (IDR default), translations
- `RecentTransactionsWidget.tsx`: timezone-aware dates, IDR default, translations
- `MonthlyTrendsChart.tsx`: timezone-aware formatInTimeZone, translations
- `TransactionList.tsx`: timezone-aware dates, locale-aware currency, translations
- `TransactionFilterBar.tsx`: translations
- `change-currency-form.tsx`: default changed from USD to IDR
- Settings page: added ChangeLocaleForm component

### New files
- `frontend/messages/en.json`
- `frontend/messages/id.json`
- `frontend/src/i18n/request.ts`
- `frontend/src/i18n/provider.tsx`
- `frontend/src/features/settings/profile/components/change-locale-form.tsx`
- `frontend/src/lib/locale-utils.ts`

### Verification notes
- Backend: Prisma schema pushed to database successfully
- Currency: IDR uses id-ID locale (e.g. Rp 10.000), other currencies use en-US
- Timezone: All date formatting now uses formatInTimeZone with user's stored timezone
- Language: Settings page now has language selector, refreshes page on change to apply locale from cookie
