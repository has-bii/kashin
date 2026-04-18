import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface ImportMessageData {
  batchId: string
  total: number
  pendingImportEmail: number
  skippedImportEmail: number
}

const importMessages = async (messageIds: string[]) => {
  const { data } = await api.post<ImportMessageData>("/gmail/import", { messageIds })

  return data
}

export const useImportMessages = () => {
  const mutation = useMutation({
    mutationFn: (messageIds: string[]) => importMessages(messageIds),
    onSuccess: () => {
      toast.success("Import in process")
    },
    onError: (error) => {
      toast.error(error.message ?? "Unexpected error has occurred")
    },
  })

  return mutation
}
