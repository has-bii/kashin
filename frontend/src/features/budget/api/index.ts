import { Budget } from "../types"
import { BudgetDto } from "../validations/schema"
import { api } from "@/lib/api"

export const getBudgetsApi = async () => {
  const { data } = await api.get<Budget[]>("/budget")
  return data
}

export const createBudgetApi = async (payload: BudgetDto & { alertThreshold: number }) => {
  const { data } = await api.post<Budget>("/budget", payload)
  return data
}

export const updateBudgetApi = async (
  id: string,
  payload: BudgetDto & { alertThreshold: number },
) => {
  const { data } = await api.put<Budget>(`/budget/${id}`, payload)
  return data
}

export const deleteBudgetApi = async (id: string) => {
  const { data } = await api.delete<Budget>(`/budget/${id}`)
  return data
}
