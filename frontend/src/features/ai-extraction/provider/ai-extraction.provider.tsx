"use client"

import { AiExtractionContext } from "../context/ai-extraction.context"
import type { AiExtraction } from "../types"
import { useState } from "react"

export function AiExtractionProvider({ children }: { children: React.ReactNode }) {
  const [selectedExtraction, setSelectedExtraction] = useState<AiExtraction | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const openConfirmDialog = (extraction: AiExtraction) => {
    setSelectedExtraction(extraction)
    setConfirmDialogOpen(true)
  }

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false)
    setTimeout(() => setSelectedExtraction(null), 200)
  }

  return (
    <AiExtractionContext.Provider
      value={{
        selectedExtraction,
        confirmDialogOpen,
        setSelectedExtraction,
        openConfirmDialog,
        closeConfirmDialog,
      }}
    >
      {children}
    </AiExtractionContext.Provider>
  )
}
