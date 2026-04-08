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
import LOCALES from "@/constants/locales.json"
import { getUserQueryOptions } from "@/features/auth/hooks/use-get-user"
import { authClient } from "@/lib/auth-client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ChangeLocaleForm() {
  const {
    data: { user },
  } = useSuspenseQuery(getUserQueryOptions())

  const saved = user.locale
  const [locale, setLocale] = useState<string>(saved)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setLocale(saved)
  }, [saved])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await authClient.updateUser({ locale })
      if (error) {
        toast.error(error.message ?? "Unexpected error has occurred")
      } else {
        toast.success("Locale updated")
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
        <CardTitle>Locale</CardTitle>
        <CardDescription>Choose the locale used to display date and amount.</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={locale} onValueChange={setLocale}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select a locale" />
          </SelectTrigger>
          <SelectContent>
            {LOCALES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="justify-between">
        <CardDescription>Used for display purposes across the app.</CardDescription>
        <Button disabled={locale === saved || isSubmitting} onClick={handleSave}>
          Save
          {isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
