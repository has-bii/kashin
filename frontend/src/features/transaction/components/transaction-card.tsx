import { Transaction } from "../types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatAmount } from "@/utils/format-amount"
import { formatDate } from "@/utils/format-date"
import { isToday } from "date-fns"

type Props = {
  data: Transaction
  onRowClick?: (transaction: Transaction) => void
}

export function TransactionCard({ data, onRowClick }: Props) {
  const { type, category, amount, description, notes, transactionDate } = data

  const date = formatDate(transactionDate, isToday(transactionDate) ? "p" : undefined)

  return (
    <Card role="button" className="rounded-3xl py-4" onClick={() => onRowClick?.(data)}>
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
        <div className="truncate">
          <h4 className="text-card-foreground font-heading truncate text-base font-bold">
            {description || "No description"}
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{category?.name || "No category"}</Badge>
            <span className="text-outline-variant text-xs">• {date}</span>
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
            {formatAmount(amount, type)}
          </span>

          {/* Type */}
          <span className="text-muted-foreground mt-2 block text-xs font-medium tracking-tighter uppercase">
            {type === "expense" ? "Expense" : "Income"}
          </span>
        </div>
      </CardContent>
      {notes && (
        <CardFooter className="border-t pt-4!">
          <p className="text-muted-foreground text-sm">{notes}</p>
        </CardFooter>
      )}
    </Card>
  )
}
