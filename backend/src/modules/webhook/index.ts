import { WebhookService } from "./service"
import Elysia from "elysia"

export const webhookController = new Elysia({ prefix: "/webhook" }).post(
  "/gmail",
  ({ headers, request, status }) => {
    const authHeader = headers["authorization"]
    if (!authHeader) return status(401)

    const token = authHeader.split(" ")

    return WebhookService.handleGmailWebhook(token[1], request)
  },
)
