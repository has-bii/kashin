export interface Message {
  id: string
  subject: string | null
  from: string | null
  date: string | null
  snippet: string | null
}

export interface GmailWatchConfig {
  historyId: string | null
  expiresAt: string | null
  subjectKeywords: string[]
  gmailLabels: string[]
  enabled: boolean
}

export interface UpdateWatchFiltersDto {
  subjectKeywords?: string[]
  gmailLabels?: string[]
  bankAccountIds?: string[]
}

export interface GmailLabel {
  id: string
  name: string
}
