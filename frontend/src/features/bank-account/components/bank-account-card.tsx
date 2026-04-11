"use client"

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
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"

type Props = {
  account: BankAccount
  onEdit: (account: BankAccount) => void
  onDelete: (account: BankAccount) => void
}

export const BankAccountCard = ({ account, onEdit, onDelete }: Props) => {
  const editHandler = () => onEdit(account)
  const deleteHandler = () => onDelete(account)

  return (
    <Card className="h-40 rounded-3xl py-4 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="bg-primary/25 size-14 rounded-xl" />

          {/* Info */}
          <div>
            <CardTitle className="font-heading text-xl font-bold">{account.bankName}</CardTitle>
            <CardDescription>{account.displayName}</CardDescription>
          </div>

          {/* Action */}
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto self-start" asChild>
              <EllipsisIcon className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={editHandler}>
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={deleteHandler}>
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex h-full">
        <p className="mt-auto text-3xl font-extrabold tracking-tight">
          {formatCurrency(account.balance)}
        </p>
      </CardContent>
    </Card>
  )
}
