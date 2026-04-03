import { authClient } from "@/lib/auth-client"
import { queryOptions } from "@tanstack/react-query"

export const getAccountListQueryOptions = () => {
  return queryOptions({
    queryKey: ["account-list"],
    queryFn: async () => {
      const { error, data } = await authClient.listAccounts()

      if (error) throw new Error(error.message ?? "Failed to get account list")

      return data
    },
  })
}
