import { format } from "date-fns"
import { id } from "date-fns/locale"

export function formatDate(dateStr: string | Date | number, formatString: string = "dd MMM") {
  return format(dateStr, formatString, { locale: id })
}
