import { Receiver } from "@upstash/qstash"
import { WebhookService } from "./service"
import { RecurringTransactionService } from "../recurring-transaction/service"
import Elysia from "elysia"

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
})

export const webhookController = new Elysia({ prefix: "/webhook" })
  .post("/gmail", ({ headers, request, status }) => {
    const authHeader = headers["authorization"]
    if (!authHeader) return status(401)

    const token = authHeader.split(" ")

    return WebhookService.handleGmailWebhook(token[1], request)
  })
  .post("/recurring-transaction", async ({ request, headers, status }) => {
    const rawBody = await request.text()

    const isValid = await receiver
      .verify({
        signature: headers["upstash-signature"] ?? "",
        body: rawBody,
      })
      .catch(() => false)

    if (!isValid) return status(401)

    const { recurringTransactionId } = JSON.parse(rawBody) as {
      recurringTransactionId: string
    }

    await RecurringTransactionService.processWebhook(recurringTransactionId)

    return { received: true }
  })
