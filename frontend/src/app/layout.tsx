import "./globals.css"
import { cn } from "@/lib/utils"
import Providers from "@/providers"
import type { Metadata } from "next"
import { Cormorant_Garamond, Geist, Geist_Mono, Inter, Jersey_10, Roboto } from "next/font/google"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"

const jersey10 = Jersey_10({ subsets: ["latin"], variable: "--font-jersey", weight: "400" })

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" })

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Kashin",
  description: "Personal expense and income tracker",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        cormorant.variable,
        "font-sans",
        roboto.variable,
        interHeading.variable,
        jersey10.variable,
      )}
    >
      <body>
        <main>
          <Providers>{children}</Providers>
        </main>
        <Toaster richColors />
        <Analytics />
      </body>
    </html>
  )
}
