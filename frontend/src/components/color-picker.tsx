import { CATEGORY_COLORS } from "@/constants/category-colors"
import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

type Props = ComponentProps<"div"> & {
  value: string
  onChangeValue: (value: string) => void
}

export function ColorPicker({ value, onChangeValue, className, ...props }: Props) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)} {...props}>
      {CATEGORY_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "aspect-square flex-1 rounded-full border",
            value === color && "outline-primary/50 outline-4",
            className,
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChangeValue(color)}
        />
      ))}
    </div>
  )
}
