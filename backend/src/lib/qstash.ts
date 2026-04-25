import { ENV } from "../config/env"
import { Client, Receiver } from "@upstash/qstash"

export const qstash = new Client({
  baseUrl: ENV.QSTASH.url,
  token: ENV.QSTASH.token,
})

export const receiver = new Receiver({
  currentSigningKey: ENV.QSTASH.currentSigningKey,
  nextSigningKey: ENV.QSTASH.nextSigningKey,
})
