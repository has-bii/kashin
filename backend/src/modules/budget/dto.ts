import { t } from "elysia"

export const createBody = t.Object({
  categoryId: t.String(),
  amount: t.Number({ minimum: 0.01 }),
  period: t.Union([t.Literal("daily"), t.Literal("weekly"), t.Literal("monthly")]),
  alertThreshold: t.Optional(t.Number({ minimum: 0.01, maximum: 1 })),
})

export const updateBody = t.Partial(createBody)

export type CreateInput = (typeof createBody)["static"]
export type UpdateInput = (typeof updateBody)["static"]
