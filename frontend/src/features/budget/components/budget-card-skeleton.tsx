import { Skeleton } from "@/components/ui/skeleton"

export default function BudgetCardSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => (
    <Skeleton key={i} className="aspect-video w-full rounded-3xl" />
  ))
}
