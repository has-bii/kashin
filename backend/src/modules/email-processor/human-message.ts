import { HumanMessage } from "@langchain/core/messages"

export interface GenerateHumanMessage {
  subject: string
  fromAddress: string
  text?: string
  html?: string
  date?: string
}

export function generateHumanMessage({
  subject,
  fromAddress,
  text,
  html,
  date,
}: GenerateHumanMessage) {
  const promptText = `Extract transaction details from the following email:

<email>
  <receipt-date>${date || "empty"}</receipt-date>
  <from>${fromAddress}</from>
  <subject>${subject}</subject>
  <email-text>
    ${text || "empty"}
  </email-text>
  <email-parsed-html>
    ${html || "empty"}
  </email-parsed-html>
</email>`

  return new HumanMessage({ content: promptText })
}
