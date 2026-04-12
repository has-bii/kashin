"use client"

import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "./ui/field"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { ScrollArea } from "./ui/scroll-area"
import { Skeleton } from "./ui/skeleton"
import { getBanksQueryOptions } from "@/features/bank/api/get-banks.query"
import { cn } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Wallet } from "lucide-react"
import Image from "next/image"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof RadioGroup>

export function BankPicker(props: Props) {
  const { data: banks } = useSuspenseQuery(getBanksQueryOptions())

  return (
    <RadioGroup {...props}>
      <ScrollArea className="max-h-96 w-full rounded-xl border">
        <div className="grid grid-cols-1 gap-2 p-4">
          {banks.map((bank) => (
            <FieldLabel key={bank.name} htmlFor={`bank-${bank.name}`}>
              <Field orientation="horizontal">
                {bank.imageUrl ? (
                  <Image
                    src={bank.imageUrl}
                    alt={bank.name}
                    width={44}
                    height={44}
                    className="rounded-full border"
                  />
                ) : (
                  <div className="flex size-11 items-center justify-center rounded-full border">
                    <Wallet className="size-6" />
                  </div>
                )}
                <FieldContent className="gap-0.5">
                  <FieldTitle>{bank.name}</FieldTitle>
                  <FieldDescription className={cn(!bank.isSupportEmail && "text-destructive")}>
                    {bank.isSupportEmail ? "Auto input by email" : "Manual input"}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value={bank.id} id={`bank-${bank.name}`} />
              </Field>
            </FieldLabel>
          ))}
        </div>
      </ScrollArea>
    </RadioGroup>
  )
}

export function BankPickerSkeleton() {
  return (
    <div className="max-h-96 w-full rounded-xl border">
      <div className="grid grid-cols-1 gap-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
