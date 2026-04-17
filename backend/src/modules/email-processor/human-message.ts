import { HumanMessage } from "@langchain/core/messages"

interface Args {
  fromAddress: string
  subject: string
  text?: string
  html?: string
}

export function generateHumanMessage({ subject, fromAddress, text, html }: Args) {
  const promptText = `Extract transaction details from the following email:

<email>
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
