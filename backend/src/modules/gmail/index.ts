import { authMacro } from "../../macros/auth.macro"
import { getMessagesQuery, importMessagesBody, updateWatchFiltersBody } from "./dto"
import { GmailService } from "./service"
import Elysia from "elysia"

export const gmailController = new Elysia({ prefix: "/gmail" })
  .use(authMacro)
  .get("/", async ({ user, query }) => GmailService.getMessages(user.id, query), {
    auth: true,
    query: getMessagesQuery,
  })
  .post("/import", async ({ user, body }) => GmailService.importMessages(user.id, body), {
    auth: true,
    body: importMessagesBody,
  })
  .get("/labels", async ({ user }) => GmailService.getLabels(user.id), {
    auth: true,
  })
  .get("/watch", async ({ user }) => GmailService.getWatchConfig(user.id), {
    auth: true,
  })
  .post("/watch/enable", async ({ user }) => GmailService.enableWatch(user.id), {
    auth: true,
  })
  .post("/watch/disable", async ({ user }) => GmailService.disableWatch(user.id), {
    auth: true,
  })
  .patch("/watch/filters", async ({ user, body }) => GmailService.updateFilters(user.id, body), {
    auth: true,
    body: updateWatchFiltersBody,
  })
