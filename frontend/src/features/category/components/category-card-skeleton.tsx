import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-md" />
          <Skeleton className="h-4 w-sm" />
        </div>
        <span className="select-none">
          <Skeleton className="size-12" />
        </span>
      </CardContent>
    </Card>
  )
}
