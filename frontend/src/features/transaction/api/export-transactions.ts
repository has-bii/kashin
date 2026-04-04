import { api } from "@/lib/api"

type ExportFilters = {
  type?: string
  categoryId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export async function exportTransactionsCsv(filters: ExportFilters): Promise<void> {
  const response = await api.get("/transaction/export", {
    params: filters,
    responseType: "blob",
  })

  const url = URL.createObjectURL(response.data as Blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "transactions.csv"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
