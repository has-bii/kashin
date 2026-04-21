import { importMessagesApi } from "../api"
import { MESSAGES_QUERY_KEY } from "../query"
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
