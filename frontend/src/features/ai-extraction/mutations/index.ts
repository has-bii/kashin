import {
  cancelAiExtractionApi,
  confirmAiExtractionApi,
  reanalyzeAiExtractionApi,
  rejectAiExtractionApi,
} from "../api"
import { AI_EXTRACTIONS_QUERY_KEY } from "../query"
import { TRANSACTIONS_QUERY_KEY } from "@/features/transaction/query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useConfirmAiExtractionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      confirmAiExtractionApi(id, body),
    onSuccess: () => {
      toast.success("Transaction created from extraction")
      queryClient.invalidateQueries({ queryKey: [AI_EXTRACTIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to confirm extraction"),
  })
}

export const useRejectAiExtractionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectAiExtractionApi,
    onSuccess: () => {
      toast.success("Extraction rejected")
      queryClient.invalidateQueries({ queryKey: [AI_EXTRACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to reject extraction"),
  })
}

export const useReanalyzeAiExtractionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reanalyzeAiExtractionApi,
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: [AI_EXTRACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to reanalyze"),
  })
}

export const useCancelAiExtractionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelAiExtractionApi,
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: [AI_EXTRACTIONS_QUERY_KEY] })
    },
    onError: (e) => toast.error(e.message || "Failed to cancel"),
  })
}
