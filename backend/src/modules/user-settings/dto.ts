import { t } from "elysia"

export const updateBody = t.Object({})

export type UpdateInput = (typeof updateBody)["static"]
