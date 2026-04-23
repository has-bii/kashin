import { ENV } from "./config/env"
import { logger } from "./lib/logger"
import { betterAuthView } from "./modules/auth"
import { bankController } from "./modules/bank"
import { bankAccountController } from "./modules/bank-account"
import { budgetController } from "./modules/budget"
import { categoryController } from "./modules/category"
import { dashboardController } from "./modules/dashboard"
import { aiExtractionController } from "./modules/ai-extraction"
import { billingController } from "./modules/billing"
import { gmailController } from "./modules/gmail"
import { healthController } from "./modules/health"
import { inngestHandler } from "./modules/inngest"
import { recurringTransactionController } from "./modules/recurring-transaction"
import { transactionController } from "./modules/transaction"
import { webhookController } from "./modules/webhook"
import cors from "@elysiajs/cors"
import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"

const MAX_BODY_SIZE = 10 * 1024 * 1024 // 10 MB

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
  .use(
    cors({
      origin: ENV.APP.frontendUrl,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .onRequest(({ request, set }) => {
    requestStore.set(request, { startTime: performance.now() })

    const contentLength = request.headers.get("content-length")
    if (contentLength && Number(contentLength) > MAX_BODY_SIZE) {
      set.status = 413
      return { error: "Payload too large", code: "PAYLOAD_TOO_LARGE" }
    }

    set.headers["X-Content-Type-Options"] = "nosniff"
    set.headers["X-Frame-Options"] = "DENY"
    set.headers["X-XSS-Protection"] = "0"
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
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
  .use(aiExtractionController)
  .use(billingController)
  .use(webhookController)

export default app
