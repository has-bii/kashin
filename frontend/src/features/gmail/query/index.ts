import { type GetMessagesParams, getLabelsApi, getMessagesApi, getWatchConfigApi } from "../api"
import { queryOptions } from "@tanstack/react-query"

export const MESSAGES_QUERY_KEY = "messages" as const

export const getMessagesQueryOptions = (params: GetMessagesParams) =>
  queryOptions({
    queryKey: [MESSAGES_QUERY_KEY, params],
    queryFn: () => getMessagesApi(params),
  })

export const WATCH_CONFIG_QUERY_KEY = "gmail-watch" as const

export const getWatchConfigQueryOptions = () =>
  queryOptions({
    queryKey: [WATCH_CONFIG_QUERY_KEY],
    queryFn: getWatchConfigApi,
  })

export const LABELS_QUERY_KEY = "gmail-labels" as const

export const getLabelsQueryOptions = () =>
  queryOptions({
    queryKey: [LABELS_QUERY_KEY],
    queryFn: getLabelsApi,
  })
