import { Skeleton } from "@/components/ui/skeleton"

export function RecurringTransactionListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-3xl" />
      ))}
    </div>
  )
}
