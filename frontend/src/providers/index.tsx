"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ReactNode, useState } from "react"

type Props = {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute — data stays fresh before background refetch
            gcTime: 5 * 60 * 1000, // 5 minutes — keep unused cache in memory
            retry: 1, // one retry on failure, then surface the error
            refetchOnWindowFocus: true, // re-sync when user returns to tab
            refetchOnReconnect: true, // re-sync after network recovery
          },
          mutations: {
            retry: 0, // mutations should not silently retry
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
