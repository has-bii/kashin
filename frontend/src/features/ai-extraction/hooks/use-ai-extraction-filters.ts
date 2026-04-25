import type { AiExtractionStatus } from "../types"
import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs"

const AI_EXTRACTION_STATUSES: AiExtractionStatus[] = [
  "pending",
  "processing",
  "waitingApproval",
  "confirmed",
  "rejected",
  "failed",
]

export const useAiExtractionFilters = () => {
  const [filters, setFilters] = useQueryStates(
    {
      status:
        parseAsStringEnum<AiExtractionStatus>(AI_EXTRACTION_STATUSES).withDefault(
          "waitingApproval",
        ),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(20),
    },
    {
      shallow: false,
      clearOnDefault: true,
    },
  )

  return {
    filters,
    setFilters,
  }
}
