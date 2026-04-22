import { ENV } from "../config/env"
import { ChatOpenAI } from "@langchain/openai"

export const model = new ChatOpenAI({
  modelName: ENV.LLM.model,
  apiKey: ENV.LLM.openAiApiKey,
  configuration: {
    baseURL: ENV.LLM.baseUrl,
    defaultHeaders: {
      "HTTP-Referer": ENV.LLM.httpReferer,
      "X-Title": ENV.LLM.xTitle,
    },
  },
  reasoning: {
    effort: "high",
    summary: "detailed",
  },
  modelKwargs: {
    response_format: { type: "json_object" },
  },
  temperature: 0.1,
  maxRetries: 1,
})
