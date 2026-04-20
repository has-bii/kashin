import { getBudgetsApi } from "../api"
import { queryOptions } from "@tanstack/react-query"

export const BUDGET_QUERY_KEY = "budgets" as const

export const getBudgetsQueryOptions = () =>
  queryOptions({
    queryKey: [BUDGET_QUERY_KEY],
    queryFn: getBudgetsApi,
  })
