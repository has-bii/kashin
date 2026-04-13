import { authClient } from "@/lib/auth-client"
import { queryOptions } from "@tanstack/react-query"

export const PASSKEY_QUERY_KEY = ["passkey-list"] as const

export const getPasskeyListQueryOptions = () => {
  return queryOptions({
    queryKey: PASSKEY_QUERY_KEY,
    queryFn: async () => {
      const { error, data } = await authClient.passkey.listUserPasskeys()

      if (error) throw new Error(error.message ?? "Failed to get passkey list")

      return data
    },
  })
}
