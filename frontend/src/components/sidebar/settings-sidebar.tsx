"use client"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ArrowLeft, KeyRound, UserCog } from "lucide-react"
import Link from "next/link"
import * as React from "react"

const data = {
  navMain: [
    {
      title: "Profile",
      url: "/dashboard/settings",
      icon: <UserCog />,
    },
    {
      title: "Authentication",
      url: "/dashboard/settings/authentication",
      icon: <KeyRound />,
    },
  ],
}

export function SettingsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-muted-foreground data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <ArrowLeft className="size-5!" />
                <span className="text-base font-semibold">Back</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <React.Suspense>
          <NavMain items={data.navMain} />
        </React.Suspense>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
