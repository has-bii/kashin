import { Suspense } from "react"
import VerifyEmailForm from "../components/verify-email-form"

export function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  )
}
