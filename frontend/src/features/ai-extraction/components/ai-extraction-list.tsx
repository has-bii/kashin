import { useAiExtractionFilters } from "../hooks/use-ai-extraction-filters"
import { getAiExtractionsQueryOptions } from "../query"
import { AiExtractionCard } from "./ai-extraction-card"
import { AiExtractionFilters } from "./ai-extraction-filters"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function AiExtractionList() {
  const filters = useAiExtractionFilters()

  const { data: aiExtractions } = useSuspenseQuery(
    getAiExtractionsQueryOptions({
      ...filters.filters,
    }),
  )

  return (
    <div className="space-y-4">
      <AiExtractionFilters filters={filters} />

      <div className="grid gap-4">
        {aiExtractions.data.map((item) => (
          <AiExtractionCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  )
}
