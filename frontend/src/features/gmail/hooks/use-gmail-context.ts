import { GmailContext } from "../context/gmail.context"
import { useContext } from "react"

export const useGmailContext = () => {
  const context = useContext(GmailContext)
  if (!context) throw new Error("useGmailContext must be used within a GmailProvider")
  return context
}
