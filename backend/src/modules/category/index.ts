import { Elysia } from "elysia"
import { ZodError } from "zod/v4"
import { getSession } from "../../utils/session"
import { categoryService } from "./service"
import {
  categoryQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from "./model"
import { TransactionType } from "../../generated/prisma/client"

export const categoryModule = new Elysia({ prefix: "/categories" })
  .derive(async ({ request }) => {
    const session = await getSession(request)
    return { session }
  })
  .onBeforeHandle(({ session, status }) => {
    if (!session) return status(401, { error: "Unauthorized" })
  })
  .get("/", async ({ session, query, status }) => {
    try {
      const { type } = categoryQuerySchema.parse(query)
      const categories = await categoryService.list(
        session!.user.id,
        type as TransactionType | undefined,
      )
      return categories
    } catch (err) {
      if (err instanceof ZodError) return status(422, { error: err.issues })
      throw err
    }
  })
  .post("/", async ({ session, body, status }) => {
    try {
      const data = createCategorySchema.parse(body)
      const category = await categoryService.create(session!.user.id, data)
      return status(201, category)
    } catch (err) {
      if (err instanceof ZodError) return status(422, { error: err.issues })
      throw err
    }
  })
  .get("/:id", async ({ session, params, status }) => {
    try {
      return await categoryService.getById(params.id, session!.user.id)
    } catch (err: any) {
      if (err?.status) return status(err.status, { error: err.message })
      throw err
    }
  })
  .put("/:id", async ({ session, params, body, status }) => {
    try {
      const data = updateCategorySchema.parse(body)
      return await categoryService.update(params.id, session!.user.id, data)
    } catch (err: any) {
      if (err instanceof ZodError) return status(422, { error: err.issues })
      if (err?.status) return status(err.status, { error: err.message })
      throw err
    }
  })
  .delete("/:id", async ({ session, params, status }) => {
    try {
      await categoryService.delete(params.id, session!.user.id)
      return { message: "Category deleted" }
    } catch (err: any) {
      if (err?.status) return status(err.status, { error: err.message })
      throw err
    }
  })
