import { authClient } from "@/lib/auth-client"
import { queryOptions } from "@tanstack/react-query"

export const getAccountInfoQueryOptions = (accountId: string) => {
  return queryOptions({
    queryKey: ["account-info", accountId],
    queryFn: async () => {
      const { error, data } = await authClient.accountInfo({
        query: { accountId },
      })

      if (error) throw new Error(error.message ?? "Failed to get account info")

      return data
    },
  })
}
