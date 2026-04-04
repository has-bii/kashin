import { t } from "elysia"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
  categoryId: t.Optional(t.String()),
  dateFrom: t.Optional(t.String()),
  dateTo: t.Optional(t.String()),
  search: t.Optional(t.String()),
})
