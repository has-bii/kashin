import {
  CategoryPlainInputCreate,
  CategoryPlainInputUpdate,
} from "../../generated/prismabox/Category"
import { t } from "elysia"

export const getAllQuery = t.Object({
  type: t.Optional(t.Union([t.Literal("expense"), t.Literal("income")])),
})

export const createBody = CategoryPlainInputCreate
export const updateBody = CategoryPlainInputUpdate

export type CreateInput = (typeof createBody)["static"]
export type UpdateInput = (typeof updateBody)["static"]
export type GetAllQuery = (typeof getAllQuery)["static"]
