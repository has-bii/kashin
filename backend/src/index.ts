import { betterAuthView } from "./modules/auth"
import { bankController } from "./modules/bank"
import { bankAccountController } from "./modules/bank-account"
import { budgetController } from "./modules/budget"
import { categoryController } from "./modules/category"
import { dashboardController } from "./modules/dashboard"
import { emailImportController } from "./modules/email-import"
import { emailLogController } from "./modules/email-log"
import { gmailController } from "./modules/gmail"
import { inngestHandler } from "./modules/inngest"
import { recurringTransactionController } from "./modules/recurring-transaction"
import { transactionController } from "./modules/transaction"
import { userSettingsController } from "./modules/user-settings"
import { webhookController } from "./modules/webhook"
import cors from "@elysiajs/cors"
import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"
import { logger } from "./lib/logger"

const requestStore = new WeakMap<Request, { startTime: number }>()

const app = new Elysia({ prefix: "/api" })
  .onRequest(({ request }) => {
    requestStore.set(request, { startTime: performance.now() })
  })
  .onAfterResponse(({ request, set }) => {
    const path = new URL(request.url).pathname
    if (path === "/api/health") return

    const entry = requestStore.get(request)
    logger.info({
      req: { method: request.method, path },
      res: { statusCode: set.status },
      responseTime: entry ? `${Math.round(performance.now() - entry.startTime)}ms` : "unknown",
    }, "request completed")
  })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400
      return { error: "Validasi gagal", code: "VALIDATION" }
    }
    if ("status" in error && typeof error.status === "number") {
      set.status = error.status
      return { error: error.message, code: code }
    }
    logger.error({ err: error, code }, "Unhandled error")
    set.status = 500
    return { error: "Terjadi kesalahan pada server", code: "INTERNAL_ERROR" }
  })
  .use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(
    rateLimit({
      duration: 60000,
      max: 100,
    }),
  )
  .all("/auth/*", betterAuthView)
  .all("/inngest", ({ request }) => inngestHandler(request))
  .use(categoryController)
  .use(transactionController)
  .use(dashboardController)
  .use(budgetController)
  .use(bankController)
  .use(bankAccountController)
  .use(recurringTransactionController)
  .use(gmailController)
  .use(emailLogController)
  .use(emailImportController)
  .use(userSettingsController)
  .use(webhookController)
  .listen(Number(process.env.PORT || 3030))

logger.info({ port: app.server?.port }, "Elysia is running")
