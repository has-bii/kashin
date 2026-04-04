import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

type Props = {
  title: string
  description: string
  icon: LucideIcon
  className?: string
  classNames?: {
    title?: string
    description?: string
  }
  emptyContent?: ReactNode
}

export default function EmptyState({
  title,
  description,
  className,
  classNames,
  icon: Icon,
  emptyContent,
}: Props) {
  return (
    <Empty className={cn(className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle className={classNames?.title}>{title}</EmptyTitle>
        <EmptyDescription className={classNames?.description}>{description}</EmptyDescription>
      </EmptyHeader>
      {emptyContent && <EmptyContent>{emptyContent}</EmptyContent>}
    </Empty>
  )
}
