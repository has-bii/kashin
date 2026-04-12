"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import { type ReactNode } from "react"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="text-xs text-muted-foreground">{error?.message ?? "An unexpected error occurred"}</p>
      </div>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  )
}

type Props = {
  children: ReactNode
}

export function QueryErrorBoundary({ children }: Props) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
}
