import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { formatDate } from "@/utils/format-date"
import { parseISO } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import React from "react"

interface DatetimePickerType {
  value: string
  onChangeValue: (value?: string) => void
}

const DatetimePickerContext = React.createContext<DatetimePickerType | null>(null)

function useDatetimePicker() {
  const context = React.useContext(DatetimePickerContext)
  if (!context) throw new Error("useDatetimePicker must used within DatetimePicker component")
  return context
}

type DatetimePickerProps = DatetimePickerType & {
  children?: React.ReactNode
}

export function DatetimePicker({ value, onChangeValue, children }: DatetimePickerProps) {
  return (
    <DatetimePickerContext.Provider value={{ value, onChangeValue }}>
      {children}
    </DatetimePickerContext.Provider>
  )
}

export function DatetimePickerDate() {
  const { value, onChangeValue } = useDatetimePicker()

  const handleChange = (selected?: Date) => {
    if (!onChangeValue) return
    onChangeValue(selected ? selected.toISOString() : new Date().toISOString())
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground bg-input/50 justify-between border-0 text-left font-normal"
        >
          {value ? formatDate(value, "PPP") : <span>Pick a date</span>}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={parseISO(value)} onSelect={handleChange} />
      </PopoverContent>
    </Popover>
  )
}

export function DatetimePickerTime() {
  const { value, onChangeValue } = useDatetimePicker()

  const parsedValue = React.useMemo(() => {
    const parsedDate = parseISO(value)

    return `${String(parsedDate.getHours()).padStart(2, "0")}:${String(parsedDate.getMinutes()).padStart(2, "0")}`
  }, [value])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      const [hour, minute] = e.target.value.split(":")

      const parsedDate = parseISO(value)

      parsedDate.setHours(Number(hour), Number(minute))

      onChangeValue(parsedDate.toISOString())
    },
    [onChangeValue, value],
  )

  return (
    <InputGroup>
      <InputGroupInput
        type="time"
        value={parsedValue}
        onChange={handleChange}
        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
      <InputGroupAddon align="inline-end">
        <ClockIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}
