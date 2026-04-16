import { LandingCta } from "@/features/landing/components/LandingCta"
import { LandingFeatures } from "@/features/landing/components/LandingFeatures"
import { LandingHero } from "@/features/landing/components/LandingHero"
import { LandingHowItWorks } from "@/features/landing/components/LandingHowItWorks"
import { LandingNav } from "@/features/landing/components/LandingNav"

export default function Home() {
  return (
    <div className="bg-background min-h-dvh">
      <LandingNav />
      <LandingHero />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingCta />
    </div>
  )
}
