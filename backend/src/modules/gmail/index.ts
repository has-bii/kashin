import { authMacro } from "../../macros/auth.macro"
import { getMessagesQuery } from "./query"
import { GmailService } from "./service"
import Elysia from "elysia"

export const gmailController = new Elysia({ prefix: "/gmail" })
  .use(authMacro)
  .get("/", async ({ user, query }) => GmailService.getMessages(user.id, query), {
    auth: true,
    query: getMessagesQuery,
  })
