import { Category } from "../types"
import { api } from "@/lib/api"
import { TransactionType } from "@/types/enums"
import { queryOptions } from "@tanstack/react-query"

type GetCategoriesInput = {
  type?: TransactionType
}

const getCategories = async (params?: GetCategoriesInput) => {
  const { data } = await api.get<Category[]>("/category", {
    params,
  })

  return data
}

export const getCategoriesQueryKey = (params?: GetCategoriesInput) =>
  params ? ["categories", params] : ["categories"]

export const getCategoriesQueryOptions = (params?: GetCategoriesInput) => {
  return queryOptions({
    queryKey: getCategoriesQueryKey(params),
    queryFn: () => getCategories(params),
  })
}
