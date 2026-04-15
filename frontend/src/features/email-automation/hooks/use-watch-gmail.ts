import { importStatusQueryKey } from "../api/get-import-status.query"
import { api } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const watchGmailApi = async () => {
  await api.get("/email-import/watch-manually")
}

export const useWatchGmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: watchGmailApi,
    onSuccess: () => {
      toast.success("Gmail watch enabled")
      queryClient.invalidateQueries({ queryKey: importStatusQueryKey() })
    },
    onError: () => {
      toast.error("Failed to enable Gmail watch")
    },
  })
}
