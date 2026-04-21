import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  useDisableWatchMutation,
  useEnableWatchMutation,
  useUpdateWatchFiltersMutation,
} from "@/features/gmail/mutations"
import { getWatchConfigQueryOptions } from "@/features/gmail/query"
import { formatDate } from "@/utils/format-date"
import { useForm } from "@tanstack/react-form"
import { useSuspenseQuery } from "@tanstack/react-query"

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function joinList(arr: string[]): string {
  return arr.join(", ")
}

export default function GmailWatchSettings() {
  const { data: config } = useSuspenseQuery(getWatchConfigQueryOptions())
  const enableMutation = useEnableWatchMutation()
  const disableMutation = useDisableWatchMutation()
  const filtersMutation = useUpdateWatchFiltersMutation()

  const isPending = enableMutation.isPending || disableMutation.isPending

  const handleToggle = (checked: boolean) => {
    if (checked) {
      enableMutation.mutate()
    } else {
      disableMutation.mutate()
    }
  }

  const form = useForm({
    defaultValues: {
      subjectKeywords: joinList(config.subjectKeywords),
      gmailLabels: joinList(config.gmailLabels),
      bankAccountIds: joinList(config.bankAccountIds),
    },
    onSubmit: ({ value }) => {
      filtersMutation.mutate({
        subjectKeywords: parseList(value.subjectKeywords),
        gmailLabels: parseList(value.gmailLabels),
        bankAccountIds: parseList(value.bankAccountIds),
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gmail Watch</CardTitle>
        <CardDescription>
          Automatically process incoming emails that match your filters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status row */}
        <div className="rounded-2xl border">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 space-y-0.5">
              <h4 className="font-semibold">Push Notifications</h4>
              <p className="text-muted-foreground text-sm">
                {config.isActive && config.expiresAt
                  ? `Active · renews ${formatDate(config.expiresAt, "dd MMM yyyy")}`
                  : "Disabled — enable to start watching your inbox"}
              </p>
            </div>
            <Badge variant={config.isActive ? "default" : "secondary"}>
              {config.isActive ? "Active" : "Inactive"}
            </Badge>
            <Switch checked={config.isActive} onCheckedChange={handleToggle} disabled={isPending} />
          </div>
        </div>

        {/* Filters form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="subjectKeywords">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Subject Keywords</Label>
                <Textarea
                  id={field.name}
                  placeholder="e.g. BCA, Mandiri, transfer"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={2}
                />
                <p className="text-muted-foreground text-xs">
                  Comma-separated keywords to match in email subjects.
                </p>
              </div>
            )}
          </form.Field>

          <form.Field name="gmailLabels">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Gmail Labels</Label>
                <Textarea
                  id={field.name}
                  placeholder="e.g. INBOX, Label_123"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={2}
                />
                <p className="text-muted-foreground text-xs">
                  Comma-separated Gmail label IDs to watch.
                </p>
              </div>
            )}
          </form.Field>

          <form.Field name="bankAccountIds">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Bank Account IDs</Label>
                <Textarea
                  id={field.name}
                  placeholder="e.g. clx1abc, clx2def"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={2}
                />
                <p className="text-muted-foreground text-xs">
                  Comma-separated bank account IDs to link to this watch.
                </p>
              </div>
            )}
          </form.Field>

          <div className="flex justify-end">
            <Button type="submit" disabled={filtersMutation.isPending}>
              {filtersMutation.isPending ? "Saving..." : "Save Filters"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
