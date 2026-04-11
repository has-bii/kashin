import { authMacro } from "../../macros/auth.macro"
import { GmailService } from "./service"
import Elysia from "elysia"

export const gmailController = new Elysia({ prefix: "/gmail" })
  .use(authMacro)
  .get("/watch-manually", async ({ user }) => GmailService.watchManually(user.id), { auth: true })
