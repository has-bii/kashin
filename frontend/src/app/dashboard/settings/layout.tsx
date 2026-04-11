import { SettingsSidebar } from "@/components/sidebar/settings-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function SettingsLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SettingsSidebar variant="sidebar" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
