import { createContext } from "react"

export interface GmailContextType {
  selectedIds: string[]
  selectId: (id: string) => void
  selectAll: (allIds: string[]) => void
  clearSelection: () => void
}

export const GmailContext = createContext<GmailContextType | null>(null)
