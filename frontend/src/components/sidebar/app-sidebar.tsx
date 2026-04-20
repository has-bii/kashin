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
  BotIcon,
  CreditCardIcon,
  LayersIcon,
  LayoutDashboardIcon,
  MailIcon,
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
      title: "Beranda",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Transaksi",
      url: "/dashboard/transactions",
      icon: <ArrowLeftRightIcon />,
    },
    {
      title: "Rekening Bank",
      url: "/dashboard/bank-accounts",
      icon: <CreditCardIcon />,
    },
    {
      title: "Kategori",
      url: "/dashboard/category",
      icon: <LayersIcon />,
    },
  ],
  tools: [
    {
      title: "Budgets",
      url: "/dashboard/budget",
      icon: <PieChartIcon />,
    },
    {
      title: "Berulang",
      url: "/dashboard/recurring-transactions",
      icon: <RepeatIcon />,
    },
    {
      title: "Gmail",
      url: "/dashboard/gmail",
      icon: <MailIcon />,
    },
    {
      title: "AI Extraction",
      url: "/dashboard/ai-extraction",
      icon: <BotIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
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
              size="lg"
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
          <NavMain label="Alat" items={data.tools} />
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
