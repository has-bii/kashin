import { authMacro } from "../../macros/auth.macro"
import { getAllQuery } from "./query"
import { TransactionService, transactionCreateBody, transactionUpdateBody } from "./service"
import Elysia, { t } from "elysia"

export const transactionController = new Elysia({ prefix: "/transaction" })
  .use(authMacro)
  .get("/", async ({ user, query }) => TransactionService.getAll(user.id, query), {
    auth: true,
    query: getAllQuery,
  })
  .post("/", async ({ user, body }) => TransactionService.create(user.id, body), {
    auth: true,
    body: transactionCreateBody,
  })
  .post(
    "/bulk-delete",
    async ({ user, body }) => TransactionService.bulkDelete(user.id, body.ids),
    {
      auth: true,
      body: t.Object({ ids: t.Array(t.String(), { minItems: 1 }) }),
    },
  )
  .get(
    "/export",
    async ({ user, query }) => {
      const csv = await TransactionService.exportAll(user.id, query)
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="transactions.csv"',
        },
      })
    },
    {
      auth: true,
      query: getAllQuery,
    },
  )
  .get("/:id", async ({ user, params }) => TransactionService.getById(user.id, params.id), {
    auth: true,
  })
  .put(
    "/:id",
    async ({ user, body, params }) => TransactionService.update(user.id, params.id, body),
    {
      auth: true,
      body: transactionUpdateBody,
    },
  )
  .delete("/:id", async ({ user, params }) => TransactionService.delete(user.id, params.id), {
    auth: true,
  })
