import { receiver } from "../../lib/qstash"
import { RecurringTransactionService } from "../recurring-transaction/service"
import { WebhookService } from "./service"
import Elysia from "elysia"

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

    const { recurringTransactionId, scheduledFor } = JSON.parse(rawBody) as {
      recurringTransactionId: string
      scheduledFor: string
    }

    await RecurringTransactionService.processWebhook(recurringTransactionId, new Date(scheduledFor))

    return { received: true }
  })
