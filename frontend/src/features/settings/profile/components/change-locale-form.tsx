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
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const LOCALES = [
  { value: "en", label: "English" },
  { value: "id", label: "Bahasa Indonesia" },
]

export default function ChangeLocaleForm() {
  const { data, isPending } = authClient.useSession()
  const user = data?.user as UserWithProfile | undefined
  const t = useTranslations("settings.language")

  const saved = user?.locale ?? "en"
  const [locale, setLocale] = useState(saved)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setLocale(saved)
  }, [saved])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await authClient.updateUser({ locale } as Parameters<
        typeof authClient.updateUser
      >[0])
      if (error) {
        toast.error(error.message ?? "Unexpected error has occurred")
      } else {
        // Set locale cookie and refresh to apply new locale
        document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
        window.location.reload()
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
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={locale} onValueChange={setLocale} disabled={isPending}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select a language" />
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
        <CardDescription>{t("helpText")}</CardDescription>
        <Button disabled={locale === saved || isSubmitting || isPending} onClick={handleSave}>
          Save
          {isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
