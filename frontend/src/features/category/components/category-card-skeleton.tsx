import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryCardSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <Skeleton key={i} className="aspect-square w-full" />
  ))
}
