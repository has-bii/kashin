"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { type ReactNode } from "react"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center">
      <AlertCircle className="text-destructive size-8" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Terjadi kesalahan</p>
        <p className="text-muted-foreground text-xs">
          {(error as { message: string }).message ?? "Terjadi kesalahan yang tidak terduga"}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        Coba lagi
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
