"use client"

import { Budget } from "../types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/format-amount"
import { getCategoryStyle } from "@/utils/get-category-style"
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"

const PERIOD_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
}

const STATUS_COLORS = {
  ok: "bg-primary",
  warning: "bg-amber-400",
  exceeded: "bg-destructive",
}

type Props = {
  data: Budget
  onUpdate?: () => void
  onDelete?: () => void
}

export function BudgetCard({ data, onUpdate, onDelete }: Props) {
  const progress = Math.min((data.spent / data.amount) * 100, 100)
  const thresholdPercent = data.alertThreshold * 100

  const categoryColor = getCategoryStyle(data.category.color)

  return (
    <div className="bg-card border-border flex h-64 w-full flex-col gap-4 rounded-3xl border p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
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

      {/* Amount */}
      <div className="mt-auto">
        <p className="text-muted-foreground mb-1 text-xs">Budget</p>
        <p className="text-xl font-bold">{formatCurrency(data.amount)}</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="bg-muted relative h-2.5 w-full overflow-hidden rounded-full">
          {/* Threshold marker */}
          <div
            className="bg-foreground/20 absolute top-0 h-full w-0.5"
            style={{ left: `${thresholdPercent}%` }}
          />
          {/* Spent fill */}
          <div
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
      </div>

      {/* Period range */}
      <p className="text-muted-foreground text-xs">
        {data.periodRange.from} – {data.periodRange.to}
      </p>
    </div>
  )
}
