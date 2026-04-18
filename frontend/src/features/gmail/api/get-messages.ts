import { Message } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

export type GetMessagesParams = {
  pageToken?: string
  after?: Date | null
  before?: Date | null
}

const getMessages = async (params: GetMessagesParams) => {
  const { data } = await api.get<{ pageToken: string | null; messages: Message[] }>("/gmail", {
    params: {
      ...params,
      after: params.after?.toISOString(),
      before: params.before?.toISOString(),
    },
  })
  return data
}

export const getMessagesQuerykey = (params: GetMessagesParams) => ["messages", params]

export const getMessagesQueryOptions = (params: GetMessagesParams) => {
  return queryOptions({
    queryKey: getMessagesQuerykey(params),
    queryFn: () => getMessages(params),
  })
}
