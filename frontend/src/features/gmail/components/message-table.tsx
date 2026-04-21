import { useGmailContext } from "../hooks/use-gmail-context"
import { Message } from "../types"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/utils/format-date"

type Props = {
  data: Message[]
}

export function MessageTable({ data }: Props) {
  const { selectedIds, selectId, selectAll } = useGmailContext()
  const isChecked = (id: string) => selectedIds.includes(id)
  const isAllSelected = selectedIds.length === data.length

  return (
    <Card className="p-0 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="pl-4">
                <Checkbox
                  className="bg-card border-input"
                  checked={isAllSelected}
                  onCheckedChange={() => selectAll(data.map((m) => m.id))}
                />
              </TableHead>
              <TableHead>FROM</TableHead>
              <TableHead>SUBJECT</TableHead>
              <TableHead>PREVIEW</TableHead>
              <TableHead className="pr-4 text-right">DATE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="pl-4">
                  <Checkbox
                    checked={isChecked(message.id)}
                    onCheckedChange={() => selectId(message.id)}
                  />
                </TableCell>
                <TableCell className="max-w-[120px] truncate font-medium">{message.from}</TableCell>
                <TableCell className="max-w-[200px] truncate">{message.subject}</TableCell>
                <TableCell className="text-muted-foreground max-w-[400px] truncate">
                  {message.snippet}
                </TableCell>
                <TableCell className="pr-4 text-right">
                  {message.date ? formatDate(message.date, "dd MMMM yyyy") : "Unknown"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
