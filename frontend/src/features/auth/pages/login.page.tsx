import { Suspense } from "react"
import LoginForm from "../components/login-form"

export function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
