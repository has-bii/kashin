import { getMessagesQueryOptions } from "../api/get-messages"
import { useImportMessages } from "../hooks/use-import-messages"
import { useMessagesFilters } from "../hooks/use-messages-filters"
import { MessageDateFilters } from "./message-date-filters"
import { MessageImportStatus } from "./message-import-status"
import { MessageTable } from "./message-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function MessagesList() {
  const { filters, setFilters } = useMessagesFilters()

  const { data } = useSuspenseQuery(getMessagesQueryOptions(filters))

  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([""])

  /* -------------------------- Select Message States ------------------------- */
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const selectId = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((acc) => acc !== id) : [...prev, id]))

  const isAllSelected = selectedIds.length === data.messages.length

  const selectAll = () =>
    setSelectedIds((prev) =>
      prev.length === data.messages.length ? [] : data.messages.map((acc) => acc.id),
    )

  /* ------------------------------- Pagination ------------------------------- */
  const isPrevAvailable = pageTokenHistory.length > 1
  const isNextAvailable = !!data.pageToken

  const handlePrev = () => {
    if (!isPrevAvailable) return

    setPageTokenHistory((prev) => {
      const newHistory = [...prev]
      newHistory.pop() // Remove the token we just used

      const prevToken = newHistory[newHistory.length - 1]

      setFilters({
        // If the previous token is "", we are back to page 1, so pass undefined
        pageToken: prevToken,
      })

      return newHistory
    })
  }

  const handleNext = () => {
    if (!data.pageToken) return

    setPageTokenHistory((prev) => [...prev, data.pageToken!])

    setFilters({
      pageToken: data.pageToken,
    })

    setSelectedIds([]) // Clear selection when changing pages
  }

  /* ------------------------------ Date Filters ------------------------------ */
  const applyDateFilter = (before: Date | null, after: Date | null) => {
    setFilters({
      pageToken: "",
      before,
      after,
    })
  }

  /* --------------------------- Import Batch Status -------------------------- */
  const [batchId, setBatchId] = useState<string | null>(null)

  /* ------------------------- Import Messages States ------------------------- */
  const { mutate, isPending } = useImportMessages()

  const handleImport = () => {
    if (selectedIds.length <= 0) {
      toast.error("Atleast select one email")
      return
    }

    mutate(selectedIds, {
      onSuccess: (data) => {
        setBatchId(data.batchId)
        setSelectedIds([])
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* Streaming Progress */}
      <MessageImportStatus batchId={batchId} close={() => setBatchId(null)} />

      <div className="flex items-end gap-4">
        {/* Date Filters */}
        <MessageDateFilters after={filters.after} before={filters.before} apply={applyDateFilter} />

        {/* Selected Info */}
        {selectedIds.length > 0 && (
          <div className="inline-flex items-center gap-2">
            <Badge variant="outline">{selectedIds.length} Selected</Badge>
            <Button className="" onClick={handleImport} disabled={isPending}>
              {isPending ? "Importing..." : "Import Selected"}
            </Button>
          </div>
        )}

        {/* Pagination */}
        <div className="ml-auto inline-flex items-center gap-2">
          <Button size="icon" disabled={!isPrevAvailable} onClick={handlePrev}>
            <ChevronLeft />
          </Button>
          <Button size="icon" disabled={!isNextAvailable} onClick={handleNext}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Table */}
      <MessageTable
        data={data.messages}
        selectedIds={selectedIds}
        selectId={selectId}
        selectAll={selectAll}
        isAllSelected={isAllSelected}
      />
    </div>
  )
}
