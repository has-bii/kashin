import { t } from "elysia"

export const summaryQuery = t.Object({
  dateFrom: t.Optional(t.String()),
  dateTo: t.Optional(t.String()),
})

export const categoryBreakdownQuery = t.Object({
  dateFrom: t.Optional(t.String()),
  dateTo: t.Optional(t.String()),
})

export const trendsQuery = t.Object({
  months: t.Optional(t.Number({ minimum: 1, maximum: 24, default: 6 })),
})

export const recentQuery = t.Object({
  limit: t.Optional(t.Number({ minimum: 1, maximum: 50, default: 5 })),
})
