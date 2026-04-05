# Quick Task 260405-jvv: Remove i18n/locale — Summary

## What was done

### Frontend
1. **Uninstalled `next-intl`** — removed from package.json via `pnpm remove`
2. **Simplified `layout.tsx`** — removed `I18nProvider` wrapper, cookie-based locale detection, dynamic message imports. Set `lang="en"` directly on `<html>`.
3. **Deleted i18n infrastructure:**
   - `src/i18n/provider.tsx`
   - `src/i18n/request.ts`
   - `src/messages/en.json`
   - `src/messages/id.json`
4. **Replaced `useTranslations()` with inline strings** in 6 components:
   - SectionCards.tsx
   - CategoryBreakdownChart.tsx
   - MonthlyTrendsChart.tsx
   - RecentTransactionsWidget.tsx
   - TransactionList.tsx
   - TransactionFilterBar.tsx
5. **Deleted `change-locale-form.tsx`** and removed it from settings page
6. **Updated `UserWithProfile` type** in `auth-client.ts` — removed `locale: string`

### Backend
1. **Removed `locale` from Prisma schema** — User model no longer has the field
2. **Removed `locale` from Better Auth** — dropped from `user.additionalFields` in `auth.ts`
3. **Reset migrations** — deleted `/migrations/`, ran `migrate reset`, `migrate dev --name init`, `prisma generate`

## Files changed
- `backend/prisma/schema.prisma`
- `backend/src/lib/auth.ts`
- `frontend/package.json`
- `frontend/src/app/layout.tsx`
- `frontend/src/lib/auth-client.ts`
- `frontend/src/app/dashboard/settings/page.tsx`
- `frontend/src/features/transaction/components/TransactionFilterBar.tsx`
- `frontend/src/features/transaction/components/TransactionList.tsx`

## Files deleted
- `frontend/src/i18n/provider.tsx`
- `frontend/src/i18n/request.ts`
- `frontend/src/messages/en.json`
- `frontend/src/messages/id.json`
- `frontend/src/features/settings/profile/components/change-locale-form.tsx`
- `backend/prisma/migrations/` (entire directory, recreated with fresh `init`)

## Verification
- Zero remaining references to `useTranslations`, `next-intl`, `I18nProvider`, `@/messages`, or `@/i18n` in frontend source
- Zero remaining references to `locale` in backend source or Prisma schema
- `locale-utils.ts` (currency formatting) and `calendar.tsx` (react-day-picker) untouched — correctly unrelated to i18n
