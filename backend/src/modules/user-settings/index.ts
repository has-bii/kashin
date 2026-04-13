import { authMacro } from "../../macros/auth.macro"
import { UserSettingsService, userSettingsUpdateBody } from "./service"
import Elysia from "elysia"

export const userSettingsController = new Elysia({ prefix: "/user-settings" })
  .use(authMacro)
  .get("/", async ({ user }) => UserSettingsService.get(user.id), {
    auth: true,
  })
  .patch("/", async ({ user, body }) => UserSettingsService.update(user.id, body), {
    auth: true,
    body: userSettingsUpdateBody,
  })
