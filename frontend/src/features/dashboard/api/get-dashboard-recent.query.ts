import type { RecentParams, Transaction } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const getDashboardRecent = async (params: RecentParams) => {
  const { data } = await api.get<Transaction[]>("/dashboard/recent", { params })
  return data
}

export const getDashboardRecentQueryKey = (params: RecentParams) => [
  "dashboard",
  "recent",
  params,
]

export const getDashboardRecentQueryOptions = (params: RecentParams) => {
  return queryOptions({
    queryKey: getDashboardRecentQueryKey(params),
    queryFn: () => getDashboardRecent(params),
  })
}
