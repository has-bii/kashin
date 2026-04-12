import type { TrendsMonth, TrendsParams } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const getDashboardTrends = async (params: TrendsParams) => {
  const { data } = await api.get<TrendsMonth[]>("/dashboard/trends", { params })
  return data
}

export const getDashboardTrendsQueryKey = (params: TrendsParams) => ["dashboard", "trends", params]

export const getDashboardTrendsQueryOptions = (params: TrendsParams) => {
  return queryOptions({
    queryKey: getDashboardTrendsQueryKey(params),
    queryFn: () => getDashboardTrends(params),
  })
}
