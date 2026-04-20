"use client"

import { useBudgetContext } from "../hooks/use-budget-context"
import { Budget } from "../types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/format-amount"
import { getCategoryStyle } from "@/utils/get-category-style"
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  ok: "Aman",
  warning: "Peringatan",
  exceeded: "Terlampaui",
}

type Props = {
  data: Budget
}

export function BudgetCard({ data }: Props) {
  const { handleUpdateBudget, handleDeleteBudget } = useBudgetContext()

  const progress = Math.min((data.spent / data.amount) * 100, 100)
  const categoryColor = getCategoryStyle(data.category.color)
  const status = data.alertStatus

  const progressStyle =
    status === "ok"
      ? "text-primary [&>[data-slot=progress-indicator]]:bg-primary"
      : status === "warning"
        ? "text-amber-500 [&>[data-slot=progress-indicator]]:bg-amber-500"
        : "text-destructive [&>[data-slot=progress-indicator]]:bg-destructive"

  const statusBadgeStyle =
    status === "ok"
      ? "bg-green-100 text-green-700"
      : status === "warning"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"

  return (
    <Card className="h-64 w-full rounded-3xl shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="flex size-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: categoryColor?.background }}
          >
            <span>{data.category.icon}</span>
          </div>

          <div className="inline-flex items-center gap-2">
            <Badge className={cn("font-semibold uppercase", statusBadgeStyle)}>
              {STATUS_LABELS[status] ?? status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                <EllipsisIcon className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleUpdateBudget(data)}>
                    <PencilIcon />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => handleDeleteBudget(data)}>
                    <Trash2Icon />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0.5">
        <h4 className="font-heading text-2xl font-bold">{data.category.name}</h4>
        <span className="text-muted-foreground capitalize">{data.period} period</span>
      </CardContent>
      <CardFooter className="h-full items-end border-t pt-3!">
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-end justify-between">
            <div className="w-fit shrink-0">
              <span className="text-2xl font-extrabold">
                {formatCurrency(data.spent, { compactDisplay: "short", notation: "compact" })}
              </span>
              <span className="text-muted-foreground ml-1 text-sm">
                / {formatCurrency(data.amount, { compactDisplay: "short", notation: "compact" })}
              </span>
            </div>
            <span className={cn("block font-bold", progressStyle)}>{progress}%</span>
          </div>
          <Progress value={progress} className={progressStyle} />
        </div>
      </CardFooter>
    </Card>
  )
}
