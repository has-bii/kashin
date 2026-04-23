import { TransactionType } from "@/types/enums"

export type AiExtractionStatus =
  | "pending"
  | "processing"
  | "waitingApproval"
  | "confirmed"
  | "rejected"
  | "failed"

export interface AiExtraction {
  id: string
  status: AiExtractionStatus
  emailFrom: string
  emailSubject: string
  emailReceivedAt: string | null
  extractedType: TransactionType | null
  extractedMerchant: string | null
  extractedAmount: string | null
  extractedCurrency: string | null
  extractedDate: string | null
  confidenceScore: number | null
  suggestedCategory: string | null
  note: string | null
  createdAt: string
  extractedCategory: {
    id: string
    name: string
    icon: string | null
    color: string | null
  } | null
  extractedBankAccount: {
    id: string
    bank: { name: string; imageUrl: string | null }
  } | null
}

export interface GetAiExtractionsParams {
  status?: AiExtractionStatus
  page?: number
  limit?: number
}

export interface PaginatedAiExtractionResponse {
  data: AiExtraction[]
  total: number
  page: number
  limit: number
  totalPages: number
}
