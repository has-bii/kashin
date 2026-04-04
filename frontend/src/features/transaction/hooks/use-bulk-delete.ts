import { useState } from "react"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useBulkDelete() {
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const mutation = useMutation({
    mutationFn: (ids: string[]) => api.post("/transaction/bulk-delete", { ids }),
    onSuccess: () => {
      toast.success("Selected transactions deleted")
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Failed to delete transactions")
    },
  })

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = (ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id))
      if (allSelected) {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      } else {
        const next = new Set(prev)
        ids.forEach((id) => next.add(id))
        return next
      }
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const isSelected = (id: string) => selectedIds.has(id)

  const selectedCount = selectedIds.size

  const deleteSelected = () => {
    if (selectedIds.size > 0) {
      mutation.mutate([...selectedIds])
    }
  }

  return {
    selectedIds,
    selectedCount,
    toggleId,
    toggleAll,
    clearSelection,
    isSelected,
    deleteSelected,
    isDeleting: mutation.isPending,
  }
}
