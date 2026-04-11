import { authMacro } from "../../macros/auth.macro"
import { BudgetService, budgetCreateBody, budgetUpdateBody } from "./service"
import Elysia from "elysia"

export const budgetController = new Elysia({ prefix: "/budget" })
  .use(authMacro)
  .get("/", async ({ user }) => BudgetService.getAll(user.id, user.timezone ?? "UTC"), {
    auth: true,
  })
  .post("/", async ({ user, body }) => BudgetService.create(user.id, body), {
    auth: true,
    body: budgetCreateBody,
  })
  .put("/:id", async ({ user, body, params }) => BudgetService.update(user.id, params.id, body), {
    auth: true,
    body: budgetUpdateBody,
  })
  .delete("/:id", async ({ user, params }) => BudgetService.delete(user.id, params.id), {
    auth: true,
  })
