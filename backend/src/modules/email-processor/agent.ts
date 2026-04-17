import { model } from "../../lib/llm"
import { contextSchema } from "./context-schema"
import { responseFormat } from "./response-format"
import { systemPrompt } from "./system-prompt"
import { handleToolErrors, tools } from "./tools"
import { createAgent, providerStrategy } from "langchain"

export const agent = createAgent({
  model,
  tools,
  systemPrompt,
  contextSchema,
  responseFormat: providerStrategy(responseFormat),
  middleware: [handleToolErrors],
})
