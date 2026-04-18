import { authMacro } from "../../macros/auth.macro"
import { getAllQuery, confirmBody } from "./dto"
import { AiExtractionService } from "./service"
import Elysia, { t } from "elysia"

export const aiExtractionController = new Elysia({ prefix: "/ai-extraction" })
  .use(authMacro)
  .get("/", async ({ user, query }) => AiExtractionService.getAll(user.id, query), {
    auth: true,
    query: getAllQuery,
  })
  .get("/:id", async ({ user, params }) => AiExtractionService.getById(user.id, params.id), {
    auth: true,
    params: t.Object({ id: t.String({ format: "uuid" }) }),
  })
  .post(
    "/:id/confirm",
    async ({ user, params, body }) => AiExtractionService.confirm(user.id, params.id, body),
    {
      auth: true,
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      body: confirmBody,
    },
  )
  .post(
    "/:id/reject",
    async ({ user, params }) => AiExtractionService.reject(user.id, params.id),
    {
      auth: true,
      params: t.Object({ id: t.String({ format: "uuid" }) }),
    },
  )
  .post(
    "/:id/reanalyze",
    async ({ user, params }) => AiExtractionService.reanalyze(user.id, params.id),
    {
      auth: true,
      params: t.Object({ id: t.String({ format: "uuid" }) }),
    },
  )
  .delete(
    "/:id",
    async ({ user, params }) => AiExtractionService.cancel(user.id, params.id),
    {
      auth: true,
      params: t.Object({ id: t.String({ format: "uuid" }) }),
    },
  )
