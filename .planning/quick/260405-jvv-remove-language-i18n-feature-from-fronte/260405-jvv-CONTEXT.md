# Quick Task 260405-jvv: Remove language/i18n feature from frontend and locale from user table, reset migrations - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Task Boundary

Remove all language/i18n/translation features from the frontend. Frontend will use English only. Remove the `locale` field from the User table. Reset migrations and regenerate Prisma client.

</domain>

<decisions>
## Implementation Decisions

### Translation strings in components
- Replace all `useTranslations()` calls with inline English strings directly in components. No extracted constants file — keep it simple since only English exists now.

### Database reset
- User confirmed data loss is acceptable. Delete `backend/prisma/migrations/` directory, run `prisma migrate reset`, then `prisma migrate dev --name init`, then `prisma generate`.

### next-intl removal
- Uninstall `next-intl` package entirely. Remove i18n infrastructure files: `src/i18n/provider.tsx`, `src/i18n/request.ts`, `src/messages/en.json`, `src/messages/id.json`. Remove I18nProvider from layout.tsx.

### Claude's Discretion
- `locale-utils.ts` is currency formatting only (Intl.NumberFormat locale tags) — NOT related to translation i18n. Keep it as-is.
- `calendar.tsx` `locale` prop is for react-day-picker day formatting — keep as-is unless it references the removed i18n system.
- `layout.tsx` currently conditionally imports messages based on cookie locale — will simplify to always use inline English content, no next-intl wrapper.

</decisions>

<specifics>
## Specific Ideas

- 6 components currently use `useTranslations()`: SectionCards, CategoryBreakdownChart, MonthlyTrendsChart, RecentTransactionsWidget, TransactionList, TransactionFilterBar
- `ChangeLocaleForm` component should be deleted entirely from settings page
- `UserWithProfile` type in `auth-client.ts` should drop the `locale: string` field
- Better Auth `additionalFields` in `auth.ts` should drop the `locale` field

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

</canonical_refs>
