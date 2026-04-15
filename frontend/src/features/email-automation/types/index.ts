export type ImportResult = {
  importId: string
  totalEmails: number
  skippedEmails: number
  queued: number
}

export type ImportStatus = {
  id: string
  status: "gathering" | "processing" | "completed" | "failed"
  totalEmails: number
  skippedEmails: number
  processedEmails: number
  failedEmails: number
  remainingEmails: number
  progress: number
}
