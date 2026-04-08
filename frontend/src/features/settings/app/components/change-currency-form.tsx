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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CURRENCIES from "@/constants/currency.json"
import { getUserQueryOptions } from "@/features/auth/hooks/use-get-user"
import { UserProfile, authClient } from "@/lib/auth-client"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export default function ChangeCurrencyForm() {
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(getUserQueryOptions())

  const user = data.user as UserProfile

  const savedCurrency = user.currency
  const [currencyCode, setCurrencyCode] = useState<string>(savedCurrency.code)
  const [currencyDecimal, setCurrencyDecimal] = useState<number>(savedCurrency.decimal)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setCurrencyCode(savedCurrency.code)
  }, [savedCurrency])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await authClient.updateUser({
        currency: {
          code: currencyCode,
          decimal: currencyDecimal,
        },
      })
      if (error) {
        toast.error(error.message ?? "Unexpected error has occurred")
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["auth"],
        })
        toast.success("Currency updated")
      }
    } catch {
      toast.error("Unexpected error has occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDirty = useMemo(() => {
    return currencyCode !== savedCurrency.code || currencyDecimal !== savedCurrency.decimal
  }, [currencyCode, currencyDecimal, savedCurrency.code, savedCurrency.decimal])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency</CardTitle>
        <CardDescription>Choose the currency used to display your transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="max-w-md">
          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel htmlFor="currency-code">Currency</FieldLabel>
              <Select name="currency-code" value={currencyCode} onValueChange={setCurrencyCode}>
                <SelectTrigger>
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
            </Field>
            <Field>
              <FieldLabel htmlFor="currency-decimal">Decimal</FieldLabel>
              <Select
                name="currency-decimal"
                value={currencyDecimal.toString()}
                onValueChange={(value) => setCurrencyDecimal(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a decimal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-between">
        <CardDescription>Used for display purposes across the app.</CardDescription>
        <Button disabled={!isDirty || isSubmitting} onClick={handleSave}>
          Save
          {isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
