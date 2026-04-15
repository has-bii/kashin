import { ImportStatus } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const getImportStatus = async () => {
  const { data } = await api.get<ImportStatus | null>("/email-import/status")
  return data
}

export const importStatusQueryKey = () => ["import-status"]

export const importStatusQueryOptions = () =>
  queryOptions({
    queryKey: importStatusQueryKey(),
    queryFn: () => getImportStatus(),
  })
