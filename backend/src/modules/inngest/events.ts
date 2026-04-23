import { inngest } from "./client"

export type ProcessEmailEventData = {
  aiExtractionId: string
  userId: string
}

export const EMAIL_EVENTS = {
  processEmail: "email/process.email",
  cancelEmail: "email/cancel.email",
} as const

export const sendProcessEmailEvent = (data: ProcessEmailEventData) =>
  inngest.send({
    name: EMAIL_EVENTS.processEmail,
    data,
  })

export const sendCancelEmailEvent = (data: { aiExtractionId: string }) =>
  inngest.send({ name: EMAIL_EVENTS.cancelEmail, data })
