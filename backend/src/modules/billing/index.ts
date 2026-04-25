import { authMacro } from "../../macros/auth.macro"
import { BillingService } from "./service"
import Elysia from "elysia"

export const billingController = new Elysia({ prefix: "/billing" })
  .use(authMacro)
  .get("/status", async ({ user }) => BillingService.getUserStatus(user.id), {
    auth: true,
  })
