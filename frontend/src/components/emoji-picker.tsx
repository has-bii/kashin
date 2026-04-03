import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import EmojiPickerReact from "emoji-picker-react"
import { useState } from "react"

const DEFAULT_ICON = ["🍔", "🏠", "🚗", "🍿", "💰"]

type Props = {
  value: string
  onChangeValue: (value: string) => void
}

export function EmojiPicker({ value, onChangeValue }: Props) {
  const [open, setOpen] = useState(false)

  const handleChangeValue = (value: string) => {
    onChangeValue(value)
    setOpen(false)
  }

  return (
    <div className="flex items-center justify-between gap-3">
      {DEFAULT_ICON.map((icon, i) => (
        <Button
          key={i}
          type="button"
          variant="outline"
          className={cn(
            "aspect-square h-auto flex-1 shrink-0 rounded-full p-0 text-3xl",
            value === icon && "bg-primary/25 border-primary",
          )}
          onClick={() => handleChangeValue(icon)}
        >
          {icon}
        </Button>
      ))}

      <Popover open={open} modal onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-primary aspect-square h-auto flex-1 rounded-full p-0"
          >
            Search
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-fit p-0">
          <EmojiPickerReact
            lazyLoadEmojis
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
            onEmojiClick={(e) => handleChangeValue(e.emoji)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
