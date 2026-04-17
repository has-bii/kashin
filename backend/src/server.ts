import app from "."
import { logger } from "./lib/logger"
import { ENV } from "./config/env"

app.listen(ENV.SERVER.port, ({ port, hostname }) => {
  logger.info(`🦊 Elysia is running at ${hostname}:${port}`)
})
