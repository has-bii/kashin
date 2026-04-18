import { useBatchImportStatus } from "../hooks/use-batch-import-status"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

type Props = {
  batchId: string | null
  close: () => void
}

export function MessageImportStatus({ batchId, close }: Props) {
  const { status: batchStatus, processed, total, isStreaming } = useBatchImportStatus(batchId)

  useEffect(() => {
    if (batchStatus === "completed") {
      toast.success("Import completed")
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchStatus])

  if (isStreaming && processed !== null && total !== null) {
    return (
      <Card className="rounded-3xl py-4 shadow-none">
        <CardContent className="px-4">
          <div className="mb-2 flex items-center gap-2">
            <Loader className="size-4 animate-spin" />
            <h5 className="font-medium">Importing Emails...</h5>

            <p className="ml-auto w-fit font-medium">
              {processed}/{total} Emails
            </p>
          </div>

          <Progress value={Math.round((processed / total) * 100)} />
        </CardContent>
      </Card>
    )
  }
}
