"use client"

import { LandingCta } from "@/features/landing/components/LandingCta"
import { LandingFeatures } from "@/features/landing/components/LandingFeatures"
import { LandingHero } from "@/features/landing/components/LandingHero"
import { LandingHowItWorks } from "@/features/landing/components/LandingHowItWorks"
import { LandingNav } from "@/features/landing/components/LandingNav"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: session } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace("/dashboard")
    }
  }, [session, router])

  return (
    <div style={{ backgroundColor: "oklch(0.09 0.008 240)", minHeight: "100dvh" }}>
      <LandingNav />
      <LandingHero />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingCta />
    </div>
  )
}
