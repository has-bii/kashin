"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TIMEZONES from "@/constants/timezones.json"
import { getUserQueryOptions } from "@/features/auth/hooks/use-get-user"
import { authClient } from "@/lib/auth-client"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ChangeTimezoneForm() {
  const queryClient = useQueryClient()
  const {
    data: { user },
  } = useSuspenseQuery(getUserQueryOptions())

  const saved = user.timezone
  const [timezone, setTimezone] = useState(saved)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setTimezone(saved)
  }, [saved])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await authClient.updateUser({ timezone })
      if (error) {
        toast.error(error.message ?? "Unexpected error has occurred")
      } else {
        toast.success("Timezone updated")
        await queryClient.invalidateQueries({
          queryKey: ["auth"],
        })
      }
    } catch {
      toast.error("Unexpected error has occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timezone</CardTitle>
        <CardDescription>
          Set your local timezone for accurate transaction timestamps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="justify-between">
        <CardDescription>
          Used to display accurate timestamps for your transactions.
        </CardDescription>
        <Button disabled={timezone === saved || isSubmitting} onClick={handleSave}>
          Save
          {isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
