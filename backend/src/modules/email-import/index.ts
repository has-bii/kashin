import { authMacro } from "../../macros/auth.macro"
import { EmailImportService } from "./service"
import Elysia, { t } from "elysia"

export const emailImportController = new Elysia({ prefix: "/email-import" })
  .use(authMacro)
  .post(
    "/",
    async ({ user, body }) => EmailImportService.importEmails(user.id, body.after, body.before),
    {
      auth: true,
      body: t.Object({
        after: t.String({ format: "date-time" }),
        before: t.String({ format: "date-time" }),
      }),
    },
  )
  .get("/status", async ({ user }) => EmailImportService.getImportStatus(user.id), {
    auth: true,
  })
