import type { CategoryBreakdownItem, CategoryBreakdownParams } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const getDashboardCategoryBreakdown = async (params: CategoryBreakdownParams) => {
  const { data } = await api.get<CategoryBreakdownItem[]>("/dashboard/category-breakdown", {
    params,
  })
  return data
}

export const getDashboardCategoryBreakdownQueryKey = (params: CategoryBreakdownParams) => [
  "dashboard",
  "category-breakdown",
  params,
]

export const getDashboardCategoryBreakdownQueryOptions = (params: CategoryBreakdownParams) => {
  return queryOptions({
    queryKey: getDashboardCategoryBreakdownQueryKey(params),
    queryFn: () => getDashboardCategoryBreakdown(params),
  })
}
