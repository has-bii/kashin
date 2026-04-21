import { disableWatchApi, enableWatchApi, importMessagesApi, updateWatchFiltersApi } from "../api"
import { MESSAGES_QUERY_KEY, WATCH_CONFIG_QUERY_KEY } from "../query"
import { UpdateWatchFiltersDto } from "../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useImportMessagesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (messageIds: string[]) => importMessagesApi(messageIds),
    onSuccess: () => {
      toast.success("Import in progress")
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to import messages")
    },
  })
}

export const useToggleWatchMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isActive: boolean) => {
      if (isActive) await enableWatchApi()
      else await disableWatchApi()
    },
    onSuccess: (_, isActive) => {
      toast.success(isActive ? "Gmail watch enabled" : "Gmail watch disabled")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update watch")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [WATCH_CONFIG_QUERY_KEY] })
    },
  })
}

export const useUpdateWatchFiltersMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateWatchFiltersDto) => updateWatchFiltersApi(body),
    onSuccess: () => {
      toast.success("Watch filters updated")
      queryClient.invalidateQueries({ queryKey: [WATCH_CONFIG_QUERY_KEY] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update filters")
    },
  })
}
