import {
  CategoryPlainInputCreate,
  CategoryPlainInputUpdate,
} from "../../generated/prismabox/Category"
import { authMacro } from "../../macros/auth.macro"
import { getAllQuery } from "./query"
import { CategoryService } from "./service"
import Elysia from "elysia"

export const categoryController = new Elysia({ prefix: "/category" })
  .use(authMacro)
  .get("/", async ({ user, query }) => CategoryService.getAll(user.id, query.type), {
    auth: true,
    query: getAllQuery,
  })
  .post("/", async ({ user, body }) => CategoryService.create(user.id, body), {
    auth: true,
    body: CategoryPlainInputCreate,
  })
  .put("/:id", async ({ user, body, params }) => CategoryService.update(user.id, params.id, body), {
    auth: true,
    body: CategoryPlainInputUpdate,
  })
  .delete("/:id", async ({ user, params }) => CategoryService.delete(user.id, params.id), {
    auth: true,
  })
