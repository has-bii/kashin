"use client"

import { authClient, type UserWithProfile } from "@/lib/auth-client"
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
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "JPY", label: "JPY — Japanese Yen" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "CHF", label: "CHF — Swiss Franc" },
  { value: "CNY", label: "CNY — Chinese Yuan" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "BRL", label: "BRL — Brazilian Real" },
  { value: "MXN", label: "MXN — Mexican Peso" },
  { value: "SGD", label: "SGD — Singapore Dollar" },
  { value: "HKD", label: "HKD — Hong Kong Dollar" },
  { value: "NOK", label: "NOK — Norwegian Krone" },
  { value: "SEK", label: "SEK — Swedish Krona" },
  { value: "DKK", label: "DKK — Danish Krone" },
  { value: "NZD", label: "NZD — New Zealand Dollar" },
  { value: "ZAR", label: "ZAR — South African Rand" },
  { value: "KRW", label: "KRW — South Korean Won" },
  { value: "TRY", label: "TRY — Turkish Lira" },
  { value: "IDR", label: "IDR — Indonesian Rupiah" },
]

export default function ChangeCurrencyForm() {
  const { data, isPending } = authClient.useSession()
  const user = data?.user as UserWithProfile | undefined

  const saved = user?.currency ?? "IDR"
  const [currency, setCurrency] = useState(saved)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setCurrency(saved)
  }, [saved])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await authClient.updateUser({ currency } as Parameters<
        typeof authClient.updateUser
      >[0])
      if (error) {
        toast.error(error.message ?? "Unexpected error has occurred")
      } else {
        toast.success("Currency updated")
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
        <CardTitle>Currency</CardTitle>
        <CardDescription>Choose the currency used to display your transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={currency} onValueChange={setCurrency} disabled={isPending}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select a currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="justify-between">
        <CardDescription>Used for display purposes across the app.</CardDescription>
        <Button
          disabled={currency === saved || isSubmitting || isPending}
          onClick={handleSave}
        >
          Save
          {isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
