import { Category } from "../types"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"
import { queryOptions } from "@tanstack/react-query"

type GetCategoriesInput = {
  type: TransactionType | null
}

const getCategories = async (params: GetCategoriesInput) => {
  const { data } = await api.get<Category[]>("/category", {
    params,
  })

  return data
}

export const getCategoriesQueryKey = (params: GetCategoriesInput) => ["categories", params]

export const getCategoriesQueryOptions = (params: GetCategoriesInput) => {
  return queryOptions({
    queryKey: getCategoriesQueryKey(params),
    queryFn: () => getCategories(params),
  })
}
