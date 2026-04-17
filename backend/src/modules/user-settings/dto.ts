import { t } from "elysia"

export const updateBody = t.Object({
  filterEmailsByBank: t.Boolean(),
})

export type UpdateInput = (typeof updateBody)["static"]
