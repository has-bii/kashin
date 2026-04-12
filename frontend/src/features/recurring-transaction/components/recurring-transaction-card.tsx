"use client"

import { useToggleRecurringTransaction } from "../hooks/use-toggle-recurring-transaction"
import { RecurringTransaction } from "../types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatAmount } from "@/utils/format-amount"
import { formatDate } from "@/utils/format-date"
import { Loader2, PauseIcon, PlayIcon } from "lucide-react"

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
  const toggle = useToggleRecurringTransaction()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggle.mutate(data.id)
  }

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
          <h4 className="text-card-foreground font-heading truncate text-base font-bold">
            {description || "No description"}
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{category?.name || "Uncategorized"}</Badge>
            <Badge variant="outline">{frequencyLabels[frequency]}</Badge>
            <span className="text-outline-variant text-xs">
              • Next: {formatDate(nextDueDate, "MMM d")}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              "font-heading text-base font-extrabold",
              type === "expense" ? "text-destructive" : "text-primary",
            )}
          >
            {formatAmount(amount, type)}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            disabled={toggle.isPending}
            onClick={handleToggle}
            aria-label={isActive ? "Pause recurring transaction" : "Activate recurring transaction"}
          >
            {toggle.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : isActive ? (
              <PauseIcon className="size-3.5" />
            ) : (
              <PlayIcon className="size-3.5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
