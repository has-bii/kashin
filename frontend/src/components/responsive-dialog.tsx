"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import React from "react"

export type ResponsiveDialogContextType = {
  open: boolean
  setOpen: (state: boolean) => void
  isMobile: boolean
}

export const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextType | null>(null)

export const useResponsiveDialog = () => {
  const ctx = React.useContext(ResponsiveDialogContext)
  if (!ctx) throw new Error("useResponsiveDialog must be used within a ResponsiveDialog component")
  return ctx
}

type ResponsiveDialogProps = {
  title: string
  description: string
  children: React.ReactNode
  trigger?: React.ReactNode
}

function ResponsiveDialog({ title, description, trigger, children }: ResponsiveDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  const value = { open, setOpen, isMobile }

  if (isMobile) {
    return (
      <ResponsiveDialogContext.Provider value={value}>
        <Drawer open={open} onOpenChange={setOpen}>
          {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
          </DrawerContent>
        </Drawer>
      </ResponsiveDialogContext.Provider>
    )
  }
  return (
    <ResponsiveDialogContext.Provider value={value}>
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </ResponsiveDialogContext.Provider>
  )
}

ResponsiveDialog.displayName = "ResponsiveDialog"

type ResponsiveDialogFooterProps = {
  children?: React.ReactNode
}

function ResponsiveDialogFooter({ children }: ResponsiveDialogFooterProps) {
  const { isMobile } = useResponsiveDialog()

  if (isMobile) return <DrawerFooter className="flex-col-reverse">{children}</DrawerFooter>

  return <DialogFooter>{children}</DialogFooter>
}

export { ResponsiveDialog, ResponsiveDialogFooter }
