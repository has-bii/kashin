"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

function getErrorMessage(error: string): string {
  const lower = error.toLowerCase()

  if (lower.includes("email") || lower.includes("match")) {
    return "The Google account email doesn't match your signed-in email. Sign in with that email first, or link from the matching account."
  }

  if (lower.includes("already") || lower.includes("linked")) {
    return "This Google account is already linked to another user."
  }

  return error
}

export default function OAuthErrorHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const error = searchParams.get("error")
    if (!error) return

    toast.error(getErrorMessage(decodeURIComponent(error)))
    router.replace("/dashboard/settings/authentication")
  }, [searchParams, router])

  return null
}
