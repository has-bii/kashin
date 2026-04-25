import { getAiExtractionsApi } from "../api"
import type { GetAiExtractionsParams } from "../types"
import { queryOptions } from "@tanstack/react-query"

export const AI_EXTRACTIONS_QUERY_KEY = "ai-extractions" as const

export const getAiExtractionsQueryOptions = (params: GetAiExtractionsParams) =>
  queryOptions({
    queryKey: [AI_EXTRACTIONS_QUERY_KEY, params],
    queryFn: () => getAiExtractionsApi(params),
  })
