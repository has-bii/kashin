import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDate } from "@/utils/format-date"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

type Props = {
  before: Date | null
  after: Date | null
  apply: (before: Date | null, after: Date | null) => void
}

export function MessageDateFilters({ after, before, apply }: Props) {
  const [afterDefault, setAfterDefault] = useState<Date | null>(after)
  const [beforeDefault, setBeforeDefault] = useState<Date | null>(before)

  const handleApply = () => {
    apply(beforeDefault, afterDefault)
  }

  const handleClear = () => {
    setAfterDefault(null)
    setBeforeDefault(null)
    apply(null, null)
  }

  const isSetted = !!afterDefault || !!beforeDefault

  return (
    <div className="inline-flex max-w-lg flex-1 items-end gap-2">
      {/* After */}
      <div className="flex-1 space-y-1">
        <FieldLabel>From Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!afterDefault}
              className="data-[empty=true]:text-muted-foreground bg-input/50 w-full justify-between text-left font-normal"
            >
              {afterDefault ? formatDate(afterDefault, "PPP") : <span>Pick a date</span>}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={afterDefault || undefined}
              onSelect={(value) => setAfterDefault(value || null)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Before */}
      <div className="flex-1 space-y-1">
        <FieldLabel>To Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!beforeDefault}
              className="data-[empty=true]:text-muted-foreground bg-input/50 w-full justify-between text-left font-normal"
            >
              {beforeDefault ? formatDate(beforeDefault, "PPP") : <span>Pick a date</span>}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={beforeDefault || undefined}
              onSelect={(value) => setBeforeDefault(value || null)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {isSetted && (
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      )}
      <Button onClick={handleApply}>Apply</Button>
    </div>
  )
}
