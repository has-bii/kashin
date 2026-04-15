import { HumanMessage } from "@langchain/core/messages"

interface Args {
  fromAddress: string
  subject: string
  body: string
}

export function generateHumanMessage({ subject, fromAddress, body }: Args) {
  const promptText = `Extract transaction details from the following email:

<email>
  <from>${fromAddress}</from>
  <subject>${subject}</subject>
  <body>
${body}
  </body>
</email>`

  return new HumanMessage({ content: promptText })
}
