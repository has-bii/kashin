import { getCategoriesApi } from "../api"
import { GetCategoriesParams } from "../types"
import { queryOptions } from "@tanstack/react-query"

export const CATEGORIES_QUERY_KEY = "categories" as const

export const getCategoriesQueryOptions = (params: GetCategoriesParams) => {
  return queryOptions({
    queryKey: [CATEGORIES_QUERY_KEY, params],
    queryFn: () => getCategoriesApi(params),
  })
}
