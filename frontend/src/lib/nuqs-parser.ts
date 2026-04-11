import { format, isValid, parseISO } from "date-fns"
import { createParser } from "nuqs"

export const parseAsDate = createParser({
  parse: (value) => {
    const date = parseISO(value)

    return isValid(date) ? date : null
  },
  serialize: (value) => {
    return format(value, "yyyy-MM-dd")
  },
})
