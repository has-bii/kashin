import { EventEmitter } from "events"
import { Client } from "pg"
import { logger } from "./logger"
import { ENV } from "../config/env"

export type ProgressPayload = {
  batchId: string
  userId: string
  aiExtractionId: string
  status: string
  seq: number
}

class PgListener extends EventEmitter {
  private client: Client | null = null
  private reconnectDelay = 1000
  private stopping = false

  async connect() {
    this.stopping = false
    await this._createAndListen()
  }

  private async _createAndListen() {
    const client = new Client({ connectionString: ENV.DATABASE.url })
    this.client = client

    client.on("error", (err) => {
      logger.error({ err }, "pg-listener: client error")
      this._scheduleReconnect()
    })

    client.on("end", () => {
      if (!this.stopping) {
        logger.warn("pg-listener: connection ended, reconnecting")
        this._scheduleReconnect()
      }
    })

    try {
      await client.connect()
      this.reconnectDelay = 1000
      await client.query("LISTEN email_import_progress")
      logger.info("pg-listener: listening on email_import_progress")

      client.on("notification", (msg) => {
        if (!msg.payload) return
        try {
          const payload = JSON.parse(msg.payload) as ProgressPayload
          this.emit("progress", payload)
        } catch (err) {
          logger.error({ err, raw: msg.payload }, "pg-listener: failed to parse notification")
        }
      })
    } catch (err) {
      logger.error({ err }, "pg-listener: failed to connect")
      this._scheduleReconnect()
    }
  }

  private _scheduleReconnect() {
    if (this.stopping) return
    const delay = this.reconnectDelay
    this.reconnectDelay = Math.min(delay * 2, 30000)
    logger.info({ delayMs: delay }, "pg-listener: scheduling reconnect")
    setTimeout(() => {
      if (!this.stopping) this._createAndListen()
    }, delay)
  }

  async disconnect() {
    this.stopping = true
    if (this.client) {
      try {
        await this.client.end()
      } catch {
        // ignore errors on shutdown
      }
      this.client = null
    }
    logger.info("pg-listener: disconnected")
  }
}

export const pgListener = new PgListener()
