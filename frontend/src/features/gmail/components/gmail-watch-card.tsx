import { useDisableWatchMutation, useEnableWatchMutation } from "../mutations"
import { getWatchConfigQueryOptions } from "../query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { formatDate } from "@/utils/format-date"
import { useSuspenseQuery } from "@tanstack/react-query"
import Link from "next/link"

export function GmailWatchCard() {
  const { data: config } = useSuspenseQuery(getWatchConfigQueryOptions())
  const enableMutation = useEnableWatchMutation()
  const disableMutation = useDisableWatchMutation()

  const isPending = enableMutation.isPending || disableMutation.isPending

  const handleToggle = (checked: boolean) => {
    if (checked) {
      enableMutation.mutate()
    } else {
      disableMutation.mutate()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Gmail Watch</CardTitle>
            <CardDescription>Automatically process new emails as they arrive</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={config.isActive ? "default" : "secondary"}>
              {config.isActive ? "Active" : "Inactive"}
            </Badge>
            <Switch checked={config.isActive} onCheckedChange={handleToggle} disabled={isPending} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {config.isActive && config.expiresAt
            ? `Renews ${formatDate(config.expiresAt, "dd MMM yyyy")}`
            : "Enable to receive automatic email processing"}
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/settings/app">Watch Settings</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
