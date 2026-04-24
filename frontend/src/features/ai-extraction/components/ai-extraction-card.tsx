import { AiExtraction, AiExtractionStatus } from "../types"
import { AI_EXTRACTION_STATUSES } from "./ai-extraction-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/utils/format-amount"
import { formatDate } from "@/utils/format-date"
import { InfoIcon } from "lucide-react"
import Link from "next/link"

type Props = {
  data: AiExtraction
}

const statusStyle: Record<AiExtractionStatus, string> = {
  waitingApproval: "bg-yellow-50 border-yellow-500 text-yellow-600",
  confirmed: "",
  failed: "",
  pending: "",
  processing: "",
  rejected: "",
}

export function AiExtractionCard({ data }: Props) {
  const { status, emailFrom, emailSubject, emailReceivedAt, id } = data

  const [, emailFromParsed] = emailFrom.match(/<([^>]+)>/) || []

  return (
    <Card
      role="button"
      className="gap-4 border py-4 shadow-none transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <CardHeader className="px-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="block text-sm font-medium tracking-wide">Email Source</span>
          {/* Status */}
          <Badge variant="outline" className={statusStyle[status]}>
            {AI_EXTRACTION_STATUSES[status]}
          </Badge>
        </div>
        <div className="bg-muted w-full overflow-hidden rounded-xl border px-4 py-3">
          {/* Email Detail */}
          <div className="min-w-0 flex-1">
            <CardTitle className="text-primary mb-1 truncate text-xs font-normal">
              {emailSubject}
            </CardTitle>
            <CardDescription className="truncate text-xs">
              {emailFromParsed} · {formatDate(emailReceivedAt!, "pp aa, PP")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <Content data={data} />
      </CardContent>
      <CardFooter className="justify-end gap-4 border-t px-4 pt-4!">
        <Button asChild>
          <Link href={`/dashboard/ai-extraction/${id}`}>
            Detail <InfoIcon />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function Content({ data }: Props) {
  const {
    status,
    extractedMerchant,
    extractedCategory,
    suggestedCategory,
    extractedBankAccount,
    extractedAmount,
    extractedCurrency,
  } = data

  if (status === "waitingApproval")
    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Merchant */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground block text-xs whitespace-nowrap">Merchant</span>
          <p className="text-sm font-medium tracking-wide">{extractedMerchant || "Unknown"}</p>
        </div>

        {/* Category */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground block text-xs whitespace-nowrap">Category</span>
          <p className="truncate text-sm font-medium tracking-wide">
            {extractedCategory ? extractedCategory.name : suggestedCategory || "Unknown"}
          </p>
        </div>

        {/* Bank */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground block text-xs whitespace-nowrap">
            Bank Account
          </span>
          <p className="truncate text-sm font-medium tracking-wide">
            {extractedBankAccount?.bank.name || "Unknown"}
          </p>
        </div>

        {/* Amount */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground block text-xs whitespace-nowrap">Amount</span>
          <p className="truncate font-mono text-base font-bold tracking-wide">
            {extractedAmount
              ? formatCurrency(extractedAmount, {
                  currency: extractedCurrency || "IDR",
                })
              : "Unknwon"}
          </p>
        </div>
      </div>
    )

  return <></>
}
