import { t } from "elysia"

export const getMessagesQuery = t.Object({
  pageToken: t.Optional(t.String()),
  before: t.Optional(t.String({ format: "date-time" })),
  after: t.Optional(t.String({ format: "date-time" })),
})

export const importMessagesBody = t.Object({
  messageIds: t.Array(t.String(), { minItems: 1, maxItems: 50 }),
})

export const updateWatchFiltersBody = t.Object({
  keywords: t.Optional(t.Array(t.String({ maxLength: 255 }))),
  labelIds: t.Optional(t.Array(t.String({ maxLength: 100 }))),
  bankAccountIds: t.Optional(t.Array(t.String({ format: "uuid" }))),
})

export type GetMessagesQuery = (typeof getMessagesQuery)["static"]
export type ImportMessagesBody = (typeof importMessagesBody)["static"]
export type UpdateWatchFiltersBody = (typeof updateWatchFiltersBody)["static"]
