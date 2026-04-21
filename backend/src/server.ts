import app from "."
import { logger } from "./lib/logger"
import { ENV } from "./config/env"

const shutdown = async () => {
  process.exit(0)
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

app.listen(ENV.SERVER.port, ({ port, hostname }) => {
  logger.info(`🦊 Elysia is running at ${hostname}:${port}`)
})
