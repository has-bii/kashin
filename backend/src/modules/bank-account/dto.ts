import { t } from "elysia"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
})

export const deleteQuery = t.Object({
  deleteTransactions: t.Optional(t.Boolean({ default: false })),
})

export const createBody = t.Object({
  bankId: t.String({ format: "uuid" }),
  initialBalance: t.Number(),
})

export type CreateInput = (typeof createBody)["static"]
export type GetAllQuery = (typeof getAllQuery)["static"]
