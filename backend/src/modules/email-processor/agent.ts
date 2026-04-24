import { model } from "../../lib/llm"
import { responseFormat } from "./response-format"
import { systemPrompt } from "./system-prompt"
import { createAgent, providerStrategy } from "langchain"

export const agent = createAgent({
  model,
  systemPrompt,
  responseFormat: providerStrategy(responseFormat),
})
