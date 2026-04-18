import { ENV } from "./config/env"
import { logger } from "./lib/logger"
import { betterAuthView } from "./modules/auth"
import { bankController } from "./modules/bank"
import { bankAccountController } from "./modules/bank-account"
import { budgetController } from "./modules/budget"
import { categoryController } from "./modules/category"
import { dashboardController } from "./modules/dashboard"
import { gmailController } from "./modules/gmail"
import { healthController } from "./modules/health"
import { inngestHandler } from "./modules/inngest"
import { recurringTransactionController } from "./modules/recurring-transaction"
import { transactionController } from "./modules/transaction"
import { userSettingsController } from "./modules/user-settings"
import { webhookController } from "./modules/webhook"
import cors from "@elysiajs/cors"
import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"

const requestStore = new WeakMap<Request, { startTime: number }>()

const getRateLimitKey = (req: Request): string => {
  const url = new URL(req.url)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (url.pathname.startsWith("/api/auth")) {
    return `auth:${ip}`
  }

  const cookie = req.headers.get("cookie") ?? ""
  const sessionMatch = cookie.match(/[^;]*\.session_token=([^;]+)/)
  if (sessionMatch) return `user:${sessionMatch[1]}`

  return `ip:${ip}`
}

const getRateLimitMax = (key: string): number => {
  return key.startsWith("auth:") ? 10 : 60
}

export const app = new Elysia({ prefix: "/api" })
  .onRequest(({ request }) => {
    requestStore.set(request, { startTime: performance.now() })
  })
  .onAfterResponse(({ request, set }) => {
    const path = new URL(request.url).pathname
    if (path === "/api/health" || path === "/api/inngest") return

    const entry = requestStore.get(request)
    logger.info(
      {
        req: { method: request.method, path },
        res: { statusCode: set.status },
        responseTime: entry ? `${Math.round(performance.now() - entry.startTime)}ms` : "unknown",
      },
      "request completed",
    )
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
    return { error: "An internal server error occurred", code: "INTERNAL_ERROR" }
  })
  .use(
    cors({
      origin: ENV.AUTH.frontendUrl,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .all("/inngest", ({ request }) => inngestHandler(request))
  .use(healthController)
  .use(
    rateLimit({
      duration: 60000,
      max: getRateLimitMax,
      generator: getRateLimitKey,
      countFailedRequest: true,
      errorResponse: new Response(
        JSON.stringify({ error: "Too many requests", code: "RATE_LIMITED" }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      ),
    }),
  )
  .all("/auth/*", betterAuthView)
  .use(categoryController)
  .use(transactionController)
  .use(dashboardController)
  .use(budgetController)
  .use(bankController)
  .use(bankAccountController)
  .use(recurringTransactionController)
  .use(gmailController)
  .use(userSettingsController)
  .use(webhookController)

export default app
