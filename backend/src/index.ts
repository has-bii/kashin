import { betterAuthView } from "./modules/auth"
import { bankAccountController } from "./modules/bank-account"
import { bankController } from "./modules/bank"
import { budgetController } from "./modules/budget"
import { categoryController } from "./modules/category"
import { dashboardController } from "./modules/dashboard"
import { gmailController } from "./modules/gmail"
import { recurringTransactionController } from "./modules/recurring-transaction"
import { transactionController } from "./modules/transaction"
import { webhookController } from "./modules/webhook"
import cors from "@elysiajs/cors"
import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"

const app = new Elysia({ prefix: "/api" })
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
  .use(categoryController)
  .use(transactionController)
  .use(dashboardController)
  .use(budgetController)
  .use(bankController)
  .use(bankAccountController)
  .use(recurringTransactionController)
  .use(webhookController)
  .use(gmailController)
  .listen(Number(process.env.PORT || 3030))

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
