import { pgListener, type ProgressPayload } from "./pg-listener"
import { prisma } from "./prisma"
import { logger } from "./logger"

export const progressBus = {
  subscribe(batchId: string, handler: (payload: ProgressPayload) => void): () => void {
    const listener = (payload: ProgressPayload) => {
      if (payload.batchId === batchId) handler(payload)
    }
    pgListener.on("progress", listener)
    return () => pgListener.off("progress", listener)
  },

  async publish(payload: ProgressPayload): Promise<void> {
    try {
      await prisma.$executeRaw`SELECT pg_notify('email_import_progress', ${JSON.stringify(payload)})`
    } catch (err) {
      logger.error({ err, payload }, "progress-bus: failed to publish")
    }
  },
}
