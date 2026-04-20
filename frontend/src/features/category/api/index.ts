import { Category, GetCategoriesParams } from "../types"
import { CategoryDto } from "../validations/schema"
import { api } from "@/lib/api"

export const getCategoriesApi = async (params: GetCategoriesParams) => {
  const { data } = await api.get<Category[]>("/category", {
    params,
  })
  return data
}

export const createCategoryApi = async (input: CategoryDto) => {
  const { data } = await api.post<Category>("/category", input)
  return data
}

export const updateCategoryApi = async (id: string, input: CategoryDto) => {
  const { data } = await api.put<Category>(`/category/${id}`, input)
  return data
}

export const deleteCategoryApi = async (id: string) => {
  const { data } = await api.delete<Category>(`/category/${id}`)
  return data
}
