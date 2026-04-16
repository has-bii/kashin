import { t } from "elysia"

export const getMessagesQuery = t.Object({
  pageToken: t.Optional(t.String()),
  before: t.Optional(t.String({ format: "date-time" })),
  after: t.Optional(t.String({ format: "date-time" })),
})
