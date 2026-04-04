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
import { type UserWithProfile, authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const TIMEZONES = [
  { value: "Pacific/Midway", label: "(UTC-11:00) Midway Island" },
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "America/New_York", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { value: "America/Caracas", label: "(UTC-04:30) Caracas" },
  { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time (Canada)" },
  { value: "America/Argentina/Buenos_Aires", label: "(UTC-03:00) Buenos Aires" },
  { value: "America/Sao_Paulo", label: "(UTC-03:00) Brasilia" },
  { value: "Atlantic/South_Georgia", label: "(UTC-02:00) Mid-Atlantic" },
  { value: "Atlantic/Azores", label: "(UTC-01:00) Azores" },
  { value: "Europe/London", label: "(UTC+00:00) London, Dublin, Lisbon" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris, Berlin, Rome, Madrid" },
  { value: "Europe/Helsinki", label: "(UTC+02:00) Helsinki, Kyiv, Tallinn" },
  { value: "Europe/Moscow", label: "(UTC+03:00) Moscow, St. Petersburg" },
  { value: "Asia/Tehran", label: "(UTC+03:30) Tehran" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Abu Dhabi, Muscat" },
  { value: "Asia/Kabul", label: "(UTC+04:30) Kabul" },
  { value: "Asia/Karachi", label: "(UTC+05:00) Islamabad, Karachi" },
  { value: "Asia/Kolkata", label: "(UTC+05:30) Chennai, Kolkata, Mumbai" },
  { value: "Asia/Kathmandu", label: "(UTC+05:45) Kathmandu" },
  { value: "Asia/Dhaka", label: "(UTC+06:00) Dhaka" },
  { value: "Asia/Rangoon", label: "(UTC+06:30) Yangon (Rangoon)" },
  { value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok, Hanoi" },
  { value: "Asia/Jakarta", label: "(UTC+07:00) Jakarta, West Indonesia" },
  { value: "Asia/Makassar", label: "(UTC+08:00) Makassar, Central Indonesia" },
  { value: "Asia/Shanghai", label: "(UTC+08:00) Beijing, Shanghai, Singapore" },
  { value: "Asia/Jayapura", label: "(UTC+09:00) Jayapura, East Indonesia" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo, Seoul, Osaka" },
  { value: "Australia/Adelaide", label: "(UTC+09:30) Adelaide" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney, Melbourne" },
  { value: "Pacific/Noumea", label: "(UTC+11:00) Solomon Islands" },
  { value: "Pacific/Auckland", label: "(UTC+12:00) Auckland, Wellington" },
  { value: "Pacific/Tongatapu", label: "(UTC+13:00) Nuku'alofa" },
]

export default function ChangeTimezoneForm() {
  const { data, isPending } = authClient.useSession()
  const user = data?.user as UserWithProfile | undefined

  const saved = user?.timezone ?? "Asia/Jakarta"
  const [timezone, setTimezone] = useState(saved)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setTimezone(saved)
  }, [saved])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await authClient.updateUser({ timezone } as Parameters<
        typeof authClient.updateUser
      >[0])
      if (error) {
        toast.error(error.message ?? "Unexpected error has occurred")
      } else {
        toast.success("Timezone updated")
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
        <Select value={timezone} onValueChange={setTimezone} disabled={isPending}>
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
        <Button disabled={timezone === saved || isSubmitting || isPending} onClick={handleSave}>
          Save
          {isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
