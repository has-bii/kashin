import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 @sm/main:grid-cols-2 @xl/main:grid-cols-3 @3xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-4xl" />
      ))}
    </div>
  )
}
