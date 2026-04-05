# Quick Task 260405-idi: Add i18n (Bahasa ID + EN) + fix timezone/currency investigation and corrections - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Task Boundary

Add bilingual support (Bahasa Indonesia + English) with next-intl, fix timezone rendering to use stored user timezone, fix currency formatting to use id-ID locale for IDR, and standardize all fallback defaults to IDR.

</domain>

<decisions>
## Implementation Decisions

### i18n Library
- Use **next-intl** for internationalization. Standard for Next.js, handles routing + locale-aware number/date formatting out of the box.

### Timezone Fix
- Render all dates using the **user's stored timezone** from settings. Currently dates use browser local time — the timezone setting exists but is never applied. Must make it functional.

### Currency Formatting
- Use **Intl.NumberFormat with id-ID locale** when currency is IDR (e.g. Rp 10.000). Other currencies use their standard locale formatting.

### Currency Default
- Change all USD fallback defaults to **IDR** across all components (CategoryBreakdownChart, SectionCards, RecentTransactionsWidget, change-currency-form.tsx).

### Claude's Discretion
- Translation coverage: All user-visible text in frontend should be translated (labels, placeholders, empty states, toast messages, navigation, button text, page titles, error messages).
- Default locale: Set `en` as default (matching current hardcoded English), but allow switching to `id` via settings.
- Locale stored in a settings field (similar to currency/timezone) or browser preference.

</decisions>

<specifics>
## Specific Ideas

- next-intl provides `<NextIntlClientProvider>` for client components and `getLocale` server-side helper
- `useLocale` hook + `useTranslations` hook from next-intl
- Translation files: `messages/en.json` and `messages/id.json` at project root
- Middleware for locale detection and routing (next-intl standard pattern)
- User's stored timezone is already saved via Better Auth — need a way to pass it to the frontend for date rendering (either via auth session or a dedicated API endpoint)
- Currency fallbacks to fix: SectionCards.tsx, CategoryBreakdownChart.tsx, RecentTransactionsWidget.tsx, change-currency-form.tsx
- Date formatting currently uses `date-fns` `format()` — need to integrate timezone via `date-fns-tz` or use next-intl's date utilities

</specifics>

<canonical_refs>
## Canonical References

- next-intl docs: https://next-intl.dev
- date-fns-tz for timezone-aware date formatting
- CLAUDE.md root project instructions

</canonical_refs>
