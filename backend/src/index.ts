import { betterAuthView } from "./modules/auth"
import { categoryController } from "./modules/category"
import { dashboardController } from "./modules/dashboard"
import { transactionController } from "./modules/transaction"
import cors from "@elysiajs/cors"
import { Elysia } from "elysia"

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .all("/auth/*", betterAuthView)
  .use(categoryController)
  .use(transactionController)
  .use(dashboardController)
  .listen(Number(process.env.PORT || 3030))

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
