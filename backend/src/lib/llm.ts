import { ENV } from "../config/env"
import { ChatOpenRouter } from "@langchain/openrouter"

export const model = new ChatOpenRouter({
  apiKey: ENV.LLM.apiKey,
  model: ENV.LLM.model,
  siteUrl: ENV.LLM.httpReferer,
  siteName: ENV.LLM.xTitle,
  maxRetries: 1,
  temperature: 0.1,
})
