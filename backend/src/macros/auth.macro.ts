import { Unauthorized } from "../global/error"
import { auth } from "../lib/auth"
import Elysia from "elysia"

export const authMacro = new Elysia({ name: "auth-macro" }).macro({
  auth: {
    async resolve({ request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      })

      if (!session) throw new Unauthorized("Unauthorized")

      return {
        user: session.user,
        session: session.session,
      }
    },
  },
})
