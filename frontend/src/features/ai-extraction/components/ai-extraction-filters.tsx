import { useAiExtractionFilters } from "../hooks/use-ai-extraction-filters"
import { AiExtractionStatus } from "../types"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type Props = {
  filters: ReturnType<typeof useAiExtractionFilters>
}

export const AI_EXTRACTION_STATUSES: Record<AiExtractionStatus, string> = {
  waitingApproval: "Needs Review",
  pending: "Queued",
  processing: "Analyzing",
  confirmed: "Imported",
  rejected: "Discarded",
  failed: "Failed",
}

export function AiExtractionFilters(props: Props) {
  const { filters, setFilters } = props.filters

  return (
    <div className="flex max-w-full items-start gap-4">
      {/* Status */}
      <ScrollArea className="max-w-full whitespace-nowrap">
        <div className="flex w-max items-center gap-1.5 pb-3">
          {Object.keys(AI_EXTRACTION_STATUSES).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={key === filters.status ? "default" : "outline"}
              onClick={() =>
                setFilters({
                  page: 1,
                  limit: 20,
                  status: key as AiExtractionStatus,
                })
              }
            >
              {AI_EXTRACTION_STATUSES[key as AiExtractionStatus]}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
