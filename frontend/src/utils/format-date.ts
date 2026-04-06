import { format } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

export function formatDateInTz(
  dateStr: string,
  timezone: string = "Asia/Jakarta",
  format: string = "dd MMM",
) {
  return formatInTimeZone(dateStr, timezone, format)
}

export function formatDate(dateStr: string, formatString: string = "dd MMM") {
  return format(dateStr, formatString)
}
