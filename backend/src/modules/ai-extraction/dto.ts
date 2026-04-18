import { t } from "elysia"
import { AiExtractionStatus } from "../../generated/prismabox/AiExtractionStatus"
import { __nullable__ } from "../../generated/prismabox/__nullable__"

export const getAllQuery = t.Object({
  status: t.Optional(AiExtractionStatus),
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
})

export const confirmBody = t.Object({
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
  amount: t.Optional(t.Number({ exclusiveMinimum: 0 })),
  currency: t.Optional(t.String({ minLength: 3, maxLength: 3 })),
  categoryId: t.Optional(__nullable__(t.String())),
  bankAccountId: t.Optional(__nullable__(t.String())),
  description: t.Optional(__nullable__(t.String({ maxLength: 255 }))),
  transactionDate: t.Optional(t.String({ format: "date-time" })),
  notes: t.Optional(__nullable__(t.String())),
})

export type GetAllQuery = (typeof getAllQuery)["static"]
export type ConfirmInput = (typeof confirmBody)["static"]
