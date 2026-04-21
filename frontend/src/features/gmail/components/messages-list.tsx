import { useGmailContext } from "../hooks/use-gmail-context"
import { useMessagesFilters } from "../hooks/use-messages-filters"
import { useImportMessagesMutation } from "../mutations"
import { getMessagesQueryOptions } from "../query"
import { MessageDateFilters } from "./message-date-filters"
import { MessageTable } from "./message-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function MessagesList() {
  const { filters, setFilters } = useMessagesFilters()
  const { selectedIds, selectId, selectAll, clearSelection } = useGmailContext()
  const { data } = useSuspenseQuery(getMessagesQueryOptions(filters))
  const { mutate, isPending } = useImportMessagesMutation()

  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([""])

  const isAllSelected = selectedIds.length === data.messages.length

  /* ------------------------------- Pagination ------------------------------- */
  const isPrevAvailable = pageTokenHistory.length > 1
  const isNextAvailable = !!data.pageToken

  const handlePrev = () => {
    if (!isPrevAvailable) return

    setPageTokenHistory((prev) => {
      const newHistory = [...prev]
      newHistory.pop()

      const prevToken = newHistory[newHistory.length - 1]

      setFilters({
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

    clearSelection()
  }

  /* ------------------------------ Date Filters ------------------------------ */
  const applyDateFilter = (before: Date | null, after: Date | null) => {
    setFilters({
      pageToken: "",
      before,
      after,
    })
  }

  /* --------------------------- Import Messages ----------------------------- */
  const handleImport = () => {
    if (selectedIds.length <= 0) {
      toast.error("Select at least one email")
      return
    }

    mutate(selectedIds, { onSuccess: () => clearSelection() })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        {/* Date Filters */}
        <MessageDateFilters after={filters.after} before={filters.before} apply={applyDateFilter} />

        {/* Selected Info */}
        {selectedIds.length > 0 && (
          <div className="inline-flex items-center gap-2">
            <Badge variant="outline">{selectedIds.length} Selected</Badge>
            <Button onClick={handleImport} disabled={isPending}>
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
        selectAll={() => selectAll(data.messages.map((m) => m.id))}
        isAllSelected={isAllSelected}
      />
    </div>
  )
}
