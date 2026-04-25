import { AiExtractionContext } from "../context/ai-extraction.context"
import { useContext } from "react"

export const useAiExtractionContext = () => {
  const ctx = useContext(AiExtractionContext)
  if (!ctx) throw new Error("useAiExtractionContext must be used within AiExtractionProvider")
  return ctx
}
