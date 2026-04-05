"use client"

import { NextIntlClientProvider } from "next-intl"
import { ReactNode } from "react"

type ProviderProps = {
  locale: string
  messages: Record<string, string>
  children: ReactNode
}

export function I18nProvider({ locale, messages, children }: ProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
