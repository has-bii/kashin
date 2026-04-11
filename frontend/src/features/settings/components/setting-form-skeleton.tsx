import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardFooter className="justify-between">
        <Skeleton className="h-8 w-1/3" />
      </CardFooter>
    </Card>
  )
}
