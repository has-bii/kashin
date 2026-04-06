import { Transaction } from "../types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatAmount } from "@/utils/format-amount"
import { formatDate } from "@/utils/format-date"
import { isToday } from "date-fns"

type Props = {
  data: Transaction
  onRowClick?: (transaction: Transaction) => void
  currency: string
  timezone: string
}

export function TransactionCard({ data, currency, timezone, onRowClick }: Props) {
  const { type, category, amount, description, transactionDate } = data

  const date = isToday(transactionDate) ? "Today" : formatDate(transactionDate)

  return (
    <Card role="button" className="rounded-3xl py-4 shadow-none" onClick={() => onRowClick?.(data)}>
      <CardContent className="flex items-center gap-3 px-4">
        {/* Icon */}
        <div className="bg-secondary inline-flex size-14 shrink-0 items-center justify-center rounded-xl">
          <span className="text-3xl">{category?.icon || "❓"}</span>
        </div>

        {/* Detail */}
        <div className="truncate">
          <h4 className="text-card-foreground font-heading truncate text-base font-bold">
            {description || "No description"}
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{category?.name || "Uncategorized"}</Badge>
            <span className="text-outline-variant text-[10px]">• {date}</span>
          </div>
        </div>

        <div className="ml-auto shrink-0 text-right">
          {/* Amount */}
          <span
            className={cn(
              "font-heading block text-base font-extrabold",
              type === "expense" ? "text-destructive" : "text-primary",
            )}
          >
            {formatAmount(amount, type, currency)}
          </span>

          {/* Type */}
          <span className="text-muted-foreground mt-2 block text-xs font-medium tracking-tighter uppercase">
            {type}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
