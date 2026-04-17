import { t } from "elysia"
import {
  RecurringTransactionPlainInputCreate,
  RecurringTransactionPlainInputUpdate,
} from "../../generated/prismabox/RecurringTransaction"
import { __nullable__ } from "../../generated/prismabox/__nullable__"

export const getAllQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
  isActive: t.Optional(t.Boolean()),
})

export const createBody = t.Composite([
  RecurringTransactionPlainInputCreate,
  t.Object({
    categoryId: t.Optional(__nullable__(t.String())),
  }),
])

export const updateBody = t.Composite([
  RecurringTransactionPlainInputUpdate,
  t.Object({
    categoryId: t.Optional(__nullable__(t.String())),
  }),
])

export type CreateInput = (typeof createBody)["static"]
export type UpdateInput = (typeof updateBody)["static"]
export type GetAllQuery = (typeof getAllQuery)["static"]
