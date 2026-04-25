import type { AiExtraction } from "../types"
import { createContext } from "react"

export interface AiExtractionContextType {
  selectedExtraction: AiExtraction | null
  confirmDialogOpen: boolean
  setSelectedExtraction: (extraction: AiExtraction | null) => void
  openConfirmDialog: (extraction: AiExtraction) => void
  closeConfirmDialog: () => void
}

export const AiExtractionContext = createContext<AiExtractionContextType | null>(null)
