import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function MessagesListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="inline-flex max-w-lg flex-1 items-end gap-2">
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="ml-auto inline-flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <Card className="p-0 shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="pl-4 w-12" />
                <TableHead>FROM</TableHead>
                <TableHead>SUBJECT</TableHead>
                <TableHead>PREVIEW</TableHead>
                <TableHead className="pr-4 text-right">DATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-4">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-44" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-72" />
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
