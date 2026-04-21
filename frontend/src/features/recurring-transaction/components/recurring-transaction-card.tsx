"use client"

import { useToggleRecurringTransactionMutation } from "../mutations"
import { RecurringTransaction } from "../types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { formatAmount } from "@/utils/format-amount"
import { formatDate } from "@/utils/format-date"
import { isToday } from "date-fns"

type Props = {
  data: RecurringTransaction
  onRowClick?: (item: RecurringTransaction) => void
}

const frequencyLabels: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  yearly: "Yearly",
}

export function RecurringTransactionCard({ data, onRowClick }: Props) {
  const { type, category, amount, description, frequency, nextDueDate, isActive } = data
  const toggle = useToggleRecurringTransactionMutation()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggle.mutate(data.id)
  }

  const nextDueDateLabel = formatDate(nextDueDate, isToday(nextDueDate) ? "p a" : "PP")

  return (
    <Card
      role="button"
      className={cn("rounded-3xl py-4 shadow-none", !isActive && "opacity-60")}
      onClick={() => onRowClick?.(data)}
    >
      <CardContent className="flex items-center gap-3 px-4">
        {/* Icon */}
        <div
          className={cn(
            "inline-flex size-14 shrink-0 items-center justify-center rounded-xl",
            !category && "bg-secondary",
          )}
          style={{ backgroundColor: category ? category.color : undefined }}
        >
          <span className="text-3xl">{category?.icon || "❓"}</span>
        </div>

        {/* Detail */}
        <div className="min-w-0 flex-1 truncate">
          <h4 className="text-card-foreground font-heading truncate text-lg font-bold">
            {description || "No description"}
          </h4>
          <div className="text-muted-foreground flex items-center gap-2 truncate text-xs font-medium tracking-wide uppercase">
            <span>{category?.name || "Uncategorized"}</span>
            <span>•</span>
            <span>{frequencyLabels[frequency]}</span>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex shrink-0 flex-col items-end">
          <span
            className={cn(
              "font-heading text-base font-extrabold",
              type === "expense" ? "text-destructive" : "text-primary",
            )}
          >
            {formatAmount(amount, type)}
          </span>

          <span className="text-muted-foreground mt-0.5 text-sm">{nextDueDateLabel}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4!">
        <div className="flex w-full items-center justify-between gap-2">
          <p className="text-muted-foreground">{isActive ? "Active" : "Inactive"} Status</p>
          <Switch
            checked={isActive}
            onClick={handleToggle}
            disabled={toggle.isPending}
            aria-label={isActive ? "Pause recurring transaction" : "Activate recurring transaction"}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
