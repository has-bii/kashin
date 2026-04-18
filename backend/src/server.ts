import app from "."
import { logger } from "./lib/logger"
import { pgListener } from "./lib/pg-listener"
import { ENV } from "./config/env"

pgListener.connect().catch((err) => {
  logger.error({ err }, "pg-listener: failed to start")
})

const shutdown = async () => {
  await pgListener.disconnect()
  process.exit(0)
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

app.listen(ENV.SERVER.port, ({ port, hostname }) => {
  logger.info(`🦊 Elysia is running at ${hostname}:${port}`)
})
