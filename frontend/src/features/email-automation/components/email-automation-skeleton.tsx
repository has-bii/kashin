import { Skeleton } from '@/components/ui/skeleton'

export default function EmailAutomationSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
    </div>
  )
}
