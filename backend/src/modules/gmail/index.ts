import { authMacro } from "../../macros/auth.macro"
import { GmailService } from "./service"
import Elysia, { t } from "elysia"

export const gmailController = new Elysia({ prefix: "/gmail" })
  .use(authMacro)
  .get("/watch-manually", async ({ user }) => GmailService.watchManually(user.id), { auth: true })
  .post(
    "/import",
    async ({ user, body }) => GmailService.importEmails(user.id, body.after, body.before),
    {
      auth: true,
      body: t.Object({
        after: t.String({ format: "date" }),
        before: t.String({ format: "date" }),
      }),
    },
  )
  .get("/import/status", async ({ user }) => GmailService.getImportStatus(user.id), { auth: true })
