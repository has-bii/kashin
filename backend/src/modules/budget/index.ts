import { authMacro } from "../../macros/auth.macro"
import { createBody, updateBody } from "./dto"
import { BudgetService } from "./service"
import Elysia from "elysia"

export const budgetController = new Elysia({ prefix: "/budget" })
  .use(authMacro)
  .get("/", async ({ user }) => BudgetService.getAll(user.id, "Asia/Jakarta"), {
    auth: true,
  })
  .post("/", async ({ user, body }) => BudgetService.create(user.id, body), {
    auth: true,
    body: createBody,
  })
  .put("/:id", async ({ user, body, params }) => BudgetService.update(user.id, params.id, body), {
    auth: true,
    body: updateBody,
  })
  .delete("/:id", async ({ user, params }) => BudgetService.delete(user.id, params.id), {
    auth: true,
  })
