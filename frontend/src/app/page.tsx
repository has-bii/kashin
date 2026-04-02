"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data } = authClient.useSession()
  const router = useRouter()

  const logoutHandler = async () => {
    await authClient.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex min-h-dvh w-screen flex-col items-center justify-center gap-2">
      <h1>Hello, {data?.user.name ?? "Loading..."}</h1>
      <Button onClick={logoutHandler}>Logout</Button>
    </div>
  )
}
