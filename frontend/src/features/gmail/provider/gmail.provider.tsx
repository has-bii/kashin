"use client"

import { GmailContext, type GmailContextType } from "../context/gmail.context"
import { useState } from "react"

export function GmailProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const selectId = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  const selectAll = (allIds: string[]) =>
    setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds))

  const clearSelection = () => setSelectedIds([])

  const value: GmailContextType = {
    selectedIds,
    selectId,
    selectAll,
    clearSelection,
  }

  return <GmailContext.Provider value={value}>{children}</GmailContext.Provider>
}
