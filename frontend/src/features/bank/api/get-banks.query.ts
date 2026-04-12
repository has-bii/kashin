import { Bank } from "../types"
import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

const getBanks = async () => {
  const { data } = await api.get<Bank[]>("/bank")
  return data
}

export const getBanksQueryKey = () => ["banks"]

export const getBanksQueryOptions = () =>
  queryOptions({
    queryKey: getBanksQueryKey(),
    queryFn: getBanks,
  })
