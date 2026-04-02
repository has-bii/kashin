import { cn } from "@/lib/utils"
import React, { ComponentProps } from "react"

type Props = ComponentProps<"div">

export default function MainPage({ className, ...props }: Props) {
  return <div className={cn("flex flex-1 flex-col gap-4 p-6", className)} {...props} />
}
