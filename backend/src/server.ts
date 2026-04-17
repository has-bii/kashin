import app from "."
import { logger } from "./lib/logger"

app.listen(process.env.PORT || 3030, ({ port, hostname }) => {
  logger.info(`🦊 Elysia is running at ${hostname}:${port}`)
})
