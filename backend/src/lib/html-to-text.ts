import { convert } from "html-to-text"

export function convertHtmlToText(html: string) {
  return convert(html)
}
