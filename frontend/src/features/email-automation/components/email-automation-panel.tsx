"use client"

import { importStatusQueryOptions } from "../api/get-import-status.query"
import { useImportEmailsForm } from "../hooks/use-import-emails-form"
import { useWatchGmail } from "../hooks/use-watch-gmail"
import {
  DatetimePicker,
  DatetimePickerDate,
  DatetimePickerTime,
} from "@/components/datetime-picker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Loader2, Mail } from "lucide-react"

export default function EmailAutomationPanel() {
  const { data: importStatus } = useSuspenseQuery(importStatusQueryOptions())
  const watchGmail = useWatchGmail()
  const { form } = useImportEmailsForm()

  return (
    <div className="space-y-6">
      {/* Watch Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            Gmail Watch
          </CardTitle>
          <CardDescription>Enable real-time email monitoring via Pub/Sub</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => watchGmail.mutate()} disabled={watchGmail.isPending}>
            {watchGmail.isPending && <Loader2 className="animate-spin" />}
            Setup Watch
          </Button>
        </CardContent>
      </Card>

      {/* Import Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Email Import</CardTitle>
          <CardDescription>Import emails from a specific date range</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="import-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <form.Field
                name="after"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <div className="grid grid-cols-2 gap-2">
                      <DatetimePicker
                        value={field.state.value}
                        onChangeValue={(input) => field.handleChange(input!)}
                      >
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={`after-date-${field.name}`}>From Date</FieldLabel>
                          <DatetimePickerDate />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                        <Field>
                          <FieldLabel htmlFor={`after-time-${field.name}`}>Time</FieldLabel>
                          <DatetimePickerTime />
                        </Field>
                      </DatetimePicker>
                    </div>
                  )
                }}
              />

              <form.Field
                name="before"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <div className="grid grid-cols-2 gap-2">
                      <DatetimePicker
                        value={field.state.value}
                        onChangeValue={(input) => field.handleChange(input!)}
                      >
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={`before-date-${field.name}`}>To Date</FieldLabel>
                          <DatetimePickerDate />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                        <Field>
                          <FieldLabel htmlFor={`before-time-${field.name}`}>Time</FieldLabel>
                          <DatetimePickerTime />
                        </Field>
                      </DatetimePicker>
                    </div>
                  )
                }}
              />
            </FieldGroup>

            <form.Subscribe
              children={({ canSubmit, isDirty, isSubmitting }) => (
                <Button
                  type="submit"
                  form="import-form"
                  disabled={!canSubmit || !isDirty || isSubmitting}
                >
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  Start Import
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {importStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Import Progress</CardTitle>
              <Badge
                variant={
                  importStatus.status === "completed"
                    ? "default"
                    : importStatus.status === "failed"
                      ? "destructive"
                      : "secondary"
                }
              >
                {importStatus.status.charAt(0).toUpperCase() + importStatus.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(importStatus.progress)}%</span>
              </div>
              <Progress value={importStatus.progress} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Emails</span>
                <p className="text-lg font-semibold">{importStatus.totalEmails}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Skipped</span>
                <p className="text-lg font-semibold">{importStatus.skippedEmails}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Processed</span>
                <p className="text-lg font-semibold">{importStatus.processedEmails}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Failed</span>
                <p className="text-destructive text-lg font-semibold">
                  {importStatus.failedEmails}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
