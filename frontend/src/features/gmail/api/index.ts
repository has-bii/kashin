import { GmailWatchConfig, Message, UpdateWatchFiltersDto } from "../types"
import { api } from "@/lib/api"

export type GetMessagesParams = {
  pageToken?: string
  after?: Date | null
  before?: Date | null
}

export const getMessagesApi = async (params: GetMessagesParams) => {
  const { data } = await api.get<{ pageToken: string | null; messages: Message[] }>("/gmail", {
    params: {
      ...params,
      after: params.after?.toISOString(),
      before: params.before?.toISOString(),
    },
  })
  return data
}

export interface ImportMessageData {
  total: number
  pendingImportEmail: number
  skippedImportEmail: number
  fetchFailureCount: number
}

export const importMessagesApi = async (messageIds: string[]) => {
  const { data } = await api.post<ImportMessageData>("/gmail/import", { messageIds })
  return data
}

export const getWatchConfigApi = async () => {
  const { data } = await api.get<GmailWatchConfig>("/gmail/watch")
  return data
}

export const enableWatchApi = async () => {
  const { data } = await api.post<GmailWatchConfig>("/gmail/watch/enable")
  return data
}

export const disableWatchApi = async () => {
  await api.post("/gmail/watch/disable")
}

export const updateWatchFiltersApi = async (body: UpdateWatchFiltersDto) => {
  const { data } = await api.patch<GmailWatchConfig>("/gmail/watch/filters", body)
  return data
}
