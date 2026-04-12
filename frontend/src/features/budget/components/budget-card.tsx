"use client"

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

type Props = {
  data: Budget
  onUpdate?: () => void
  onDelete?: () => void
}

export function BudgetCard({ data, onUpdate, onDelete }: Props) {
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
    <Card className="aspect-square w-full rounded-3xl shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div
            className="flex size-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: categoryColor?.background }}
          >
            <span>{data.category.icon}</span>
          </div>

          {/* Status */}
          <div className="inline-flex items-center gap-2">
            <Badge className={cn("font-semibold uppercase", statusBadgeStyle)}>{status}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                <EllipsisIcon className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={onUpdate}>
                    <PencilIcon />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2Icon />
                    Delete
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
      <CardFooter className="h-full items-end">
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

      {/* Header */}
      {/* <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex size-11 items-center justify-center rounded-2xl text-xl"
            style={{ backgroundColor: categoryColor?.background }}
          >
            <span>{data.category.icon}</span>
          </div>
          <div>
            <p className="font-semibold">{data.category.name}</p>
            <p className="text-muted-foreground text-xs">{PERIOD_LABELS[data.period]}</p>
          </div>
        </div>

        
      </div> */}

      {/* Amount */}
      {/* <div className="mt-auto">
        <p className="text-muted-foreground mb-1 text-xs">Budget</p>
        <p className="text-xl font-bold">{formatCurrency(data.amount)}</p>
      </div> */}

      {/* Progress bar */}
      {/* <div className="space-y-1.5">
        <div className="bg-muted relative h-2.5 w-full overflow-hidden rounded-full"> */}
      {/* Threshold marker */}
      {/* <div
            className="bg-foreground/20 absolute top-0 h-full w-0.5"
            style={{ left: `${thresholdPercent}%` }}
          /> */}
      {/* Spent fill */}
      {/* <div
            className={cn("h-full rounded-full transition-all", STATUS_COLORS[data.alertStatus])}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{formatCurrency(data.spent)} spent</span>
          <span
            className={cn(
              "font-medium",
              data.alertStatus === "exceeded"
                ? "text-destructive"
                : data.alertStatus === "warning"
                  ? "text-amber-500"
                  : "text-muted-foreground",
            )}
          >
            {data.remaining >= 0
              ? `${formatCurrency(data.remaining)} left`
              : `${formatCurrency(Math.abs(data.remaining))} over`}
          </span>
        </div>
      </div> */}

      {/* Period range */}
      {/* <p className="text-muted-foreground text-xs">
        {data.periodRange.from} – {data.periodRange.to}
      </p> */}
    </Card>
  )
}
