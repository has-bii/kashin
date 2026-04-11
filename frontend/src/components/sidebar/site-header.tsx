"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { MenuIcon } from "lucide-react"

type SiteHeaderProps = {
  label: string
}

export function SiteHeader({ label }: SiteHeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="relative flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 hidden md:inline-flex" />
        <Separator
          orientation="vertical"
          className="mx-2 my-auto hidden data-[orientation=vertical]:h-4 md:block"
        />

        {/* Absolute center on mobile, reset to static on desktop */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium md:static md:left-auto md:mx-0 md:translate-x-0">
          {label}
        </h1>

        {/* ml-auto pushes the button to the far right since the h1 is now absolute */}
        <button className="ml-auto md:hidden" onClick={toggleSidebar}>
          <MenuIcon className="size-5" />
        </button>
      </div>
    </header>
  )
}
