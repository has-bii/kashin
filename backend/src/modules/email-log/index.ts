import { authMacro } from "../../macros/auth.macro"
import { getAllQuery } from "./query"
import { EmailLogService } from "./service"
import Elysia from "elysia"

export const emailLogController = new Elysia({ prefix: "/email-log" })
  .use(authMacro)
  .get("/", async ({ user, query }) => EmailLogService.getAll(user.id, query), {
    auth: true,
    query: getAllQuery,
  })
