import "./globals.css"
import { cn } from "@/lib/utils"
import Providers from "@/providers"
import { I18nProvider } from "@/i18n/provider"
import enMessages from "@/../../messages/en.json"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google"
import { cookies } from "next/headers"
import { Toaster } from "sonner"

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

export const metadata: Metadata = {
  title: "Kashin",
  description: "Personal expense and income tracker",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = cookieStore.get("locale")?.value ?? "en"
  const messages =
    locale === "id"
      ? (await import("@/../../messages/id.json")).default
      : enMessages

  return (
    <html
      lang={locale}
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        roboto.variable,
        interHeading.variable,
      )}
    >
      <body>
        <main>
          <I18nProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </I18nProvider>
        </main>
        <Toaster richColors />
      </body>
    </html>
  )
}
