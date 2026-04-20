import { PaginatedTransactionResponse, Transaction } from "../types"
import { TransactionCreateDto } from "../validations/schema"
import { api } from "@/lib/api"

export type GetTransactionsParams = {
  page?: number
  limit?: number
  type?: string | null
  categoryId?: string | null
  dateFrom?: string | null
  dateTo?: string | null
  search?: string | null
}

export type ExportTransactionsParams = {
  type?: string
  categoryId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export const getTransactionsApi = async (params: GetTransactionsParams) => {
  const { data } = await api.get<PaginatedTransactionResponse>("/transaction", { params })
  return data
}

export const createTransactionApi = async (input: TransactionCreateDto) => {
  const { data } = await api.post<Transaction>("/transaction", input)
  return data
}

export const updateTransactionApi = async ({
  id,
  input,
}: {
  id: string
  input: TransactionCreateDto
}) => {
  const { data } = await api.put<Transaction>(`/transaction/${id}`, input)
  return data
}

export const deleteTransactionApi = async (id: string) => {
  const { data } = await api.delete<Transaction>(`/transaction/${id}`)
  return data
}

export const bulkDeleteTransactionsApi = async (ids: string[]) => {
  const { data } = await api.post("/transaction/bulk-delete", { ids })
  return data
}

export const exportTransactionsCsvApi = async (params: ExportTransactionsParams): Promise<void> => {
  const response = await api.get("/transaction/export", { params, responseType: "blob" })
  const url = URL.createObjectURL(response.data as Blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "transactions.csv"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
