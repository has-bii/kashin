"use client"

import { useBankAccountContext } from "../hooks/use-bank-account-context"
import type { BankAccount } from "../types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/utils/format-amount"
import { EllipsisIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"

type Props = {
  account: BankAccount
}

export const BankAccountCard = ({ account }: Props) => {
  const { handleDeleteOpen } = useBankAccountContext()

  return (
    <Card className="h-42 rounded-3xl py-4 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={account.bank.imageUrl}
            alt={account.bank.imageUrl}
            width={52}
            height={52}
            className="shrink-0 rounded-xl border"
          />
          <div className="truncate">
            <CardTitle className="font-heading text-xl font-bold">{account.bank.name}</CardTitle>
            <CardDescription className="truncate text-xs">
              {account.bank.isSupportEmail ? "Support auto input by email" : "Manual input only"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto shrink-0 self-start">
              <EllipsisIcon className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={() => handleDeleteOpen(account)}>
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <span className="text-muted-foreground block text-xs tracking-wide">CURRENT BALANCE</span>
          <p className="font-heading text-2xl font-extrabold tracking-tight">
            {formatCurrency(account.balance)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
