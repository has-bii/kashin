import { cn } from "@/lib/utils"
import { ComponentProps, ReactNode } from "react"

function SocialMethodItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  )
}

function SocialMethodIcon({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 [&_svg]:pointer-events-none [&_svg]:size-6", className)}
      {...props}
    />
  )
}

type SocialMethodContentProps = {
  asChild?: boolean
  title?: string
  description?: string
  children?: ReactNode
  className?: string
}

function SocialMethodContent(props: SocialMethodContentProps) {
  return (
    <div className={cn("w-fit shrink-0 space-y-0", props.className)}>
      {props.asChild ? (
        props.children
      ) : (
        <>
          <h4 className="font-heading font-semibold capitalize">{props.title}</h4>
          <p className="text-muted-foreground text-sm">{props.description}</p>
        </>
      )}
    </div>
  )
}

function SocialMethodAction({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("ml-auto w-fit", className)} {...props} />
}

export { SocialMethodItem, SocialMethodContent, SocialMethodIcon, SocialMethodAction }
