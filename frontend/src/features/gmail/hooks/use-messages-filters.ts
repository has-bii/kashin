import { parseAsIsoDateTime, parseAsString, useQueryStates } from "nuqs"

export const useMessagesFilters = () => {
  const [filters, setFilters] = useQueryStates(
    {
      pageToken: parseAsString.withDefault(""),
      before: parseAsIsoDateTime,
      after: parseAsIsoDateTime,
    },
    {
      shallow: false,
    },
  )

  return { filters, setFilters }
}
