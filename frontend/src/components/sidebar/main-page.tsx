import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

type Props = ComponentProps<"div">

export function MainPage({ className, ...props }: Props) {
  return <div className={cn("flex flex-1 flex-col gap-8 p-6", className)} {...props} />
}

export function MainPageHeader({ className, ...props }: Props) {
  return <div className={cn("flex items-end justify-between gap-4", className)} {...props} />
}

export function MainPageTitle({ className, ...props }: Props) {
  return <h1 className={cn("font-heading text-3xl font-bold", className)} {...props} />
}

export function MainPageDescripton({ className, ...props }: Props) {
  return <p className={cn("text-muted-foreground max-w-lg text-sm", className)} {...props} />
}

export function MainPageAction({ className, ...props }: Props) {
  return <div className={cn("inline-flex items-center gap-2", className)} {...props} />
}
