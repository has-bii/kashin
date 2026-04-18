import { t } from "elysia"
import {
  TransactionPlainInputCreate,
  TransactionPlainInputUpdate,
} from "../../generated/prismabox/Transaction"
import { __nullable__ } from "../../generated/prismabox/__nullable__"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
  categoryId: t.Optional(t.String()),
  dateFrom: t.Optional(t.String({ format: "date-time" })),
  dateTo: t.Optional(t.String({ format: "date-time" })),
  search: t.Optional(t.String()),
})

export const createBody = t.Composite([
  TransactionPlainInputCreate,
  t.Object({
    categoryId: t.Optional(__nullable__(t.String())),
    bankAccountId: t.Optional(__nullable__(t.String())),
    aiExtractionId: t.Optional(__nullable__(t.String())),
  }),
])

export const updateBody = t.Composite([
  TransactionPlainInputUpdate,
  t.Object({
    categoryId: t.Optional(__nullable__(t.String())),
    bankAccountId: t.Optional(__nullable__(t.String())),
  }),
])

export type CreateInput = (typeof createBody)["static"]
export type UpdateInput = (typeof updateBody)["static"]
export type GetAllQuery = (typeof getAllQuery)["static"]
