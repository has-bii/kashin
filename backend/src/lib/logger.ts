import { ENV } from "../config/env"
import pino from "pino"

export const logger = pino({
  level: ENV.LOG.level,
  redact: [
    "req.headers.authorization",
    "*.password",
    "*.token",
    "*.apiKey",
    "*.secret",
    "*.credentials",
  ],
  ...(ENV.LOG.nodeEnv !== "production"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
})
