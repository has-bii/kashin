import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useGmailWatchSettingsForm } from "@/features/gmail/hooks/use-gmail-watch-settings-form"
import { getLabelsQueryOptions, getWatchConfigQueryOptions } from "@/features/gmail/query"
import { formatDate } from "@/utils/format-date"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function GmailWatchSettings() {
  const { data: config } = useSuspenseQuery(getWatchConfigQueryOptions())
  const { data: labels } = useSuspenseQuery(getLabelsQueryOptions())
  const { form, filtersMutation, toggleMutation } = useGmailWatchSettingsForm(config)

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
                {config.enabled && config.expiresAt
                  ? `Active · renews ${formatDate(config.expiresAt, "dd MMM yyyy")}`
                  : "Disabled — enable to start watching your inbox"}
              </p>
            </div>
            <Badge variant={config.enabled ? "default" : "secondary"}>
              {config.enabled ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => toggleMutation.mutate(checked)}
              disabled={toggleMutation.isPending}
            />
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
                  value={field.state.value.join(", ")}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
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
                <Label>Gmail Labels</Label>
                {labels.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No labels found. Connect your Gmail account first.
                  </p>
                ) : (
                  <ScrollArea className="h-48 rounded-md border p-3">
                    <div className="space-y-2">
                      {labels.map((label) => (
                        <div key={label.id} className="flex items-center gap-2">
                          <Checkbox
                            id={label.id}
                            checked={field.state.value.includes(label.id)}
                            onCheckedChange={(checked) => {
                              const next = checked
                                ? [...field.state.value, label.id]
                                : field.state.value.filter((id) => id !== label.id)
                              field.handleChange(next)
                            }}
                          />
                          <label htmlFor={label.id} className="cursor-pointer text-sm">
                            {label.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                <p className="text-muted-foreground text-xs">
                  Select Gmail labels to watch for incoming emails.
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
