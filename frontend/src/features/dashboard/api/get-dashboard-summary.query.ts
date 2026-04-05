import type { DashboardSummary, DashboardSummaryParams } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const getDashboardSummary = async (params: DashboardSummaryParams) => {
  const { data } = await api.get<DashboardSummary>("/dashboard/summary", { params })
  return data
}

export const getDashboardSummaryQueryKey = (params: DashboardSummaryParams) => [
  "dashboard",
  "summary",
  params,
]

export const getDashboardSummaryQueryOptions = (params: DashboardSummaryParams) => {
  return queryOptions({
    queryKey: getDashboardSummaryQueryKey(params),
    queryFn: () => getDashboardSummary(params),
  })
}
