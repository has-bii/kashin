import { type GetMessagesParams, getMessagesApi } from "../api"
import { queryOptions } from "@tanstack/react-query"

export const MESSAGES_QUERY_KEY = "messages" as const

export const getMessagesQueryOptions = (params: GetMessagesParams) =>
  queryOptions({
    queryKey: [MESSAGES_QUERY_KEY, params],
    queryFn: () => getMessagesApi(params),
  })
