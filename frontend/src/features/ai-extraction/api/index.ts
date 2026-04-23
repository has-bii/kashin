import type { AiExtraction, GetAiExtractionsParams, PaginatedAiExtractionResponse } from "../types"
import type { ConfirmAiExtractionDto } from "../validations/schema"
import { api } from "@/lib/api"

export const getAiExtractionsApi = async (params: GetAiExtractionsParams = {}) => {
  const { data } = await api.get<PaginatedAiExtractionResponse>("/ai-extraction", { params })
  return data
}

export const getAiExtractionByIdApi = async (id: string) => {
  const { data } = await api.get<AiExtraction>(`/ai-extraction/${id}`)
  return data
}

export const confirmAiExtractionApi = async (id: string, body: ConfirmAiExtractionDto) => {
  const { data } = await api.post(`/ai-extraction/${id}/confirm`, body)
  return data
}

export const rejectAiExtractionApi = async (id: string) => {
  const { data } = await api.post<AiExtraction>(`/ai-extraction/${id}/reject`)
  return data
}

export const reanalyzeAiExtractionApi = async (id: string) => {
  const { data } = await api.post<{ message: string }>(`/ai-extraction/${id}/reanalyze`)
  return data
}

export const cancelAiExtractionApi = async (id: string) => {
  const { data } = await api.delete<{ message: string }>(`/ai-extraction/${id}/cancel`)
  return data
}
