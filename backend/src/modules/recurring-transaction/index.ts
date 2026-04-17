import { authMacro } from "../../macros/auth.macro"
import { RecurringTransactionService } from "./service"
import { getAllQuery, createBody, updateBody } from "./dto"
import Elysia from "elysia"

export const recurringTransactionController = new Elysia({ prefix: "/recurring-transaction" })
  .use(authMacro)
  .get("/", async ({ user, query }) => RecurringTransactionService.getAll(user.id, query), {
    auth: true,
    query: getAllQuery,
  })
  .post("/", async ({ user, body }) => RecurringTransactionService.create(user.id, body), {
    auth: true,
    body: createBody,
  })
  .get("/:id", async ({ user, params }) => RecurringTransactionService.getById(user.id, params.id), {
    auth: true,
  })
  .put(
    "/:id",
    async ({ user, params, body }) => RecurringTransactionService.update(user.id, params.id, body),
    {
      auth: true,
      body: updateBody,
    },
  )
  .delete("/:id", async ({ user, params }) => RecurringTransactionService.delete(user.id, params.id), {
    auth: true,
  })
  .patch(
    "/:id/toggle",
    async ({ user, params }) => RecurringTransactionService.toggle(user.id, params.id),
    { auth: true },
  )
