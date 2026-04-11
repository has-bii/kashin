"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback } from "react"

type Props = {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
  label?: string
}

export function NavMain({ items, label }: Props) {
  const pathname = usePathname()

  const isActive = useCallback((url: string): boolean => url === pathname, [pathname])

  return (
    <SidebarGroup className="pl-0">
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                size="md"
                tooltip={item.title}
                isActive={isActive(item.url)}
                className="rounded-l-none"
                asChild
              >
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
