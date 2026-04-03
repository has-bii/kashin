import { t } from "elysia"

export const getAllQuery = t.Object({
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
})
