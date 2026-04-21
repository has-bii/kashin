import app from "."
import { ENV } from "./config/env"
import { logger } from "./lib/logger"

const shutdown = () => {
  process.exit(0)
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

app.listen(ENV.SERVER.port, ({ port, hostname }) => {
  logger.info(`🦊 Elysia is running at ${hostname}:${port}`)
})
