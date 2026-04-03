"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

const SelectTabContext = React.createContext<{
  value?: string
  onSelect?: (value: string) => void
}>({})

function SelectTab({
  className,
  value,
  onSelect,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string
  onSelect?: (value: string) => void
}) {
  return (
    <SelectTabContext.Provider value={{ value, onSelect }}>
      <div
        data-slot="select-tab"
        className={cn(
          "bg-input/50 flex w-full items-center gap-1.5 rounded-2xl p-1.5",
          "transition-all duration-200",
          className,
        )}
        {...props}
      />
    </SelectTabContext.Provider>
  )
}

function SelectTabItem({
  className,
  value,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  value: string
}) {
  const context = React.useContext(SelectTabContext)
  const isSelected = context.value === value

  return (
    <button
      type="button"
      data-slot="select-tab-item"
      data-state={isSelected ? "active" : "inactive"}
      onClick={(e) => {
        onClick?.(e)
        context.onSelect?.(value)
      }}
      className={cn(
        "inline-flex h-10 flex-1 items-center justify-center rounded-xl px-4 text-sm font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50",
        "text-muted-foreground hover:text-foreground hover:bg-black/5",
        "data-[state=active]:text-primary data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:shadow-sm",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  )
}

export { SelectTab, SelectTabItem }
