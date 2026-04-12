"use client"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
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
import {
  ArrowLeftRightIcon,
  CreditCardIcon,
  LayersIcon,
  LayoutDashboardIcon,
  PieChartIcon,
  RepeatIcon,
  Settings2Icon,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: <ArrowLeftRightIcon />,
    },
    {
      title: "Bank Accounts",
      url: "/dashboard/bank-accounts",
      icon: <CreditCardIcon />,
    },
    {
      title: "Category",
      url: "/dashboard/category",
      icon: <LayersIcon />,
    },
    {
      title: "Recurring",
      url: "/dashboard/recurring-transactions",
      icon: <RepeatIcon />,
    },
  ],
  tools: [
    {
      title: "Budget",
      url: "/dashboard/budget",
      icon: <PieChartIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2Icon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader className="pl-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="md"
              className="text-foreground rounded-l-none data-[slot=sidebar-menu-button]:p-4!"
              asChild
            >
              <Link href="/dashboard">
                <Wallet className="size-5!" />
                <span className="text-base font-semibold">Kashin.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <React.Suspense>
          {/* Main */}
          <NavMain items={data.navMain} />

          {/* Tools */}
          <NavMain label="Tools" items={data.tools} />
        </React.Suspense>
        <NavSecondary items={data.navSecondary} className="mt-auto pl-0" />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
