import cors from "@elysiajs/cors"
import { Elysia } from "elysia"

const app = new Elysia()
  .use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .listen(Number(process.env.PORT || 3030))

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
