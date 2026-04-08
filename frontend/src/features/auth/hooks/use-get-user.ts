import { UserProfile, authClient } from "@/lib/auth-client"
import { queryOptions } from "@tanstack/react-query"

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data } = await authClient.getSession()

      if (!data) throw new Error("Failed to get user data")

      return { session: data.session, user: data.user as UserProfile }
    },
  })
}
